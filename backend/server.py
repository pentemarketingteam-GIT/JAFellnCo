from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Cookie, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import logging
import uuid
import tempfile
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta

import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai import OpenAISpeechToText, OpenAITextToSpeech

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------------- Models ----------------
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    session_id: str
    message: str
    history: List[ChatMessage] = []
    intake: dict = {}


class IntakeSubmit(BaseModel):
    business_name: Optional[str] = ""
    contact_name: Optional[str] = ""
    turnover: Optional[str] = ""
    service_interested: Optional[str] = ""
    current_accountant: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""


class ContactSubmit(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    message: str


class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "onyx"


class MeetingSubmit(BaseModel):
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    mode: Optional[str] = "office"
    date: Optional[str] = ""
    time: Optional[str] = ""
    notes: Optional[str] = ""


class AdvisorState(BaseModel):
    messages: List[dict] = []
    intake: dict = {}
    canvas: dict = {}
    interactive: dict = {}


# ---------------- Auth helpers ----------------
async def get_current_user(session_token: Optional[str] = Cookie(None),
                           authorization: Optional[str] = Header(None)):
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    if not token:
        return None
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    return user


@api_router.get("/")
async def root():
    return {"message": "J A Fell & Co API"}


@api_router.post("/auth/session")
async def auth_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")

    async with httpx.AsyncClient() as hc:
        r = await hc.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id},
        )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    data = r.json()

    existing = await db.users.find_one({"email": data["email"]}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one({"user_id": user_id},
                                  {"$set": {"name": data["name"], "picture": data.get("picture", "")}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": data["email"],
            "name": data["name"],
            "picture": data.get("picture", ""),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    session_token = data["session_token"]
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(key="session_token", value=session_token, httponly=True,
                        secure=True, samesite="none", path="/", max_age=7 * 24 * 60 * 60)
    return {"user_id": user_id, "email": data["email"], "name": data["name"],
            "picture": data.get("picture", "")}


@api_router.get("/auth/me")
async def auth_me(user=None, session_token: Optional[str] = Cookie(None),
                  authorization: Optional[str] = Header(None)):
    user = await get_current_user(session_token, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@api_router.post("/auth/logout")
async def auth_logout(response: Response, session_token: Optional[str] = Cookie(None),
                      authorization: Optional[str] = Header(None)):
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ---------------- AI Chat ----------------
SYSTEM_PROMPT = """You are "Fiona", the AI advisory assistant for J A Fell & Co, a modern firm of Chartered Accountants based at 40 Hoghton Street, Southport, PR9 0PQ, United Kingdom (phone 01704 500299). The firm blends traditional values with forward-thinking strategies and serves growing businesses and financial advisers across the North West and the wider UK. The principal is Oliver Grills. A free discovery call can be booked via Calendly.

The firm's core services are:
- Personal Tax (year-round planning and self-assessment returns; multiple income streams, investments, property)
- Business Accounts & Tax (statutory accounts, corporation tax, HMRC & Companies House compliance, cash flow and structure advice)
- Payroll Services (staff wages, PAYE, pensions auto-enrolment, HMRC submissions)
- Bookkeeping (cloud-based, automated systems, real-time insight, audit-ready records)
- Business Formation (choosing the right structure and registering the business)
- FCA & SRA Compliance (capital adequacy monitoring, client money reconciliations for regulated firms)

The firm has a specialism: accountants for financial advisers (mortgage and financial advisory businesses) — helping them avoid tax surprises, get clear financial visibility, and plan growth. They work with solo-preneurs, growing practices and 7-figure practices.

Your job: have a warm, professional, concise conversation with prospective clients, understand their needs, explain relevant services, and gently gather intake details for onboarding. Speak in British English. Keep spoken replies to 2-4 sentences. Encourage booking a free discovery call.

You control a live visual canvas on the left of the user's screen. On EVERY response you decide what it should show.

You MUST respond with ONLY a single valid JSON object (no markdown, no code fences) with this exact shape:
{
  "reply": "your conversational message to the user",
  "canvas": {
    "view": "welcome | service_tiles | service | pain_points | fee_slider | package_builder | roi | comparison | intake | team | quote | scheduler",
    "data": { ... }
  },
  "intake": {
    "business_name": "",
    "contact_name": "",
    "turnover": "",
    "service_interested": "",
    "current_accountant": ""
  }
}

Rules for "intake": always return the FULL intake object, merging what you already know (given below) with anything new you learned from the latest user message. Leave a field as an empty string if still unknown. Never lose previously captured values.

Rules for "canvas.view":
- "welcome": default, when greeting or when no specific topic yet. data: {"headline": "...", "subtext": "..."}
- "service": when the user asks about a specific service. data: {"title": "Service name", "summary": "one line", "features": ["...", "...", "..."], "ideal_for": "who it suits"}
- "intake": when you are collecting or have collected onboarding details, OR the user wants to become a client / get a quote / book a call. data can be {} (the form reads from the intake object). IMPORTANT: as soon as you have captured a business name OR a contact name, you MUST use "intake" (so the user sees their details auto-filling) before ever using "quote". Only move to "quote" after the intake details have been shown.
- "team": when the user asks about the team / who they'll work with. data: {"advisor": "name", "role": "...", "bio": "...", "specialties": ["...", "..."]}. The firm's principal is Oliver Grills (Principal, Chartered Accountant and specialist accountant for financial advisers). Present Oliver Grills as the lead advisor.
- "quote": when you have enough info (turnover + service) to sketch an indicative fee, AND the intake view has already been shown. data: {"items": [{"label":"...","price":"from £XX/mo"}], "total": "from £XXX/mo", "note": "Indicative only, subject to a free consultation."}
- "scheduler": when the user wants to book a meeting, consultation or call. data: {"note": "a short line encouraging them to pick a slot"}. The visual panel lets them choose an in-person meeting at 40 Hoghton Street or a video call and pick a date and time.
- "service_tiles": use when the user is exploring, unsure where to start, or asks broadly "what do you offer / how can you help". Shows a grid of tappable service cards they can click to dive into any service. data: {"intro": "a short inviting line, e.g. 'Tap any service to explore it.'"}
- "pain_points": use when the user sounds stressed, overwhelmed, behind, or when you want to understand their challenges. Shows a selectable grid of common adviser pain points they can tick. data: {"intro": "a short empathetic line"}
- "fee_slider": use when discussing cost/pricing and the turnover is not yet clearly known, or to let them explore fees interactively. Shows a turnover slider that estimates an indicative monthly fee live. data: {"service": "optional service name to price"}
- "package_builder": use when the user wants to combine several services or see bundled pricing. Shows a build-your-own basket of services with a running monthly total. data: {}
- "roi": use when the user mentions spending too much time on admin, bookkeeping, or chasing paperwork. Shows a calculator estimating the time and money they could reclaim. data: {}
- "comparison": use to build emotional value when the user is hesitant, comparing options, or unsure it's worth switching. Shows a flip card contrasting life now vs life with the firm. data: {"now": ["short pain", "short pain"], "withUs": ["short benefit", "short benefit"]} (optional — sensible defaults exist)

Note: the left canvas is interactive — the user can click service tiles, drag sliders, tick pain points and build packages. When they do, their action arrives as a normal user message (e.g. "Tell me about Payroll Services" or "My main challenges are: chasing invoices, year-end panic"). Respond naturally and advance the conversation, updating the canvas view to match.

Always be helpful and move the conversation toward booking a free consultation at the Southport office or a video call. Never invent tax figures as guarantees; keep quotes clearly indicative.
"""


def extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
        text = re.sub(r"\n?```$", "", text).strip()
    try:
        return json.loads(text)
    except Exception:
        m = re.search(r"\{.*\}", text, re.DOTALL)
        if m:
            try:
                return json.loads(m.group(0))
            except Exception:
                pass
    return {"reply": text, "canvas": {"view": "welcome", "data": {}}}


@api_router.post("/chat")
async def chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    transcript = ""
    for m in req.history[-12:]:
        who = "User" if m.role == "user" else "Fiona"
        transcript += f"{who}: {m.content}\n"

    known = json.dumps(req.intake or {})
    prompt = (
        f"Known intake so far (merge and preserve these): {known}\n\n"
        f"Conversation so far:\n{transcript}\n"
        f"Latest user message: {req.message}\n\n"
        f"Respond now with the JSON object only."
    )

    chat_client = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=req.session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-6")

    try:
        result = await chat_client.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"LLM error: {e}")
        raise HTTPException(status_code=500, detail="AI assistant unavailable")

    parsed = extract_json(result if isinstance(result, str) else str(result))

    if "canvas" not in parsed or not isinstance(parsed.get("canvas"), dict):
        parsed["canvas"] = {"view": "welcome", "data": {}}
    if "intake" not in parsed or not isinstance(parsed.get("intake"), dict):
        parsed["intake"] = req.intake or {}

    await db.chat_messages.insert_one({
        "session_id": req.session_id,
        "user_message": req.message,
        "assistant_reply": parsed.get("reply", ""),
        "canvas_view": parsed.get("canvas", {}).get("view"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return parsed


# ---------------- Voice ----------------
@api_router.post("/voice/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="Key not configured")
    contents = await file.read()
    suffix = ".webm"
    if file.filename and "." in file.filename:
        suffix = "." + file.filename.rsplit(".", 1)[1]
    stt = OpenAISpeechToText(api_key=EMERGENT_LLM_KEY)
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
            tmp.write(contents)
            tmp.flush()
            tmp.seek(0)
            with open(tmp.name, "rb") as audio_file:
                resp = await stt.transcribe(file=audio_file, model="whisper-1",
                                            response_format="json", language="en")
        return {"text": resp.text}
    except Exception as e:
        logger.error(f"STT error: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed")


def clean_for_tts(text: str) -> str:
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"`{1,3}[^`]*`{1,3}", "", text)
    text = re.sub(r"[*_#>~|]", "", text)
    return re.sub(r"\s+", " ", text).strip()


@api_router.post("/voice/tts")
async def tts(req: TTSRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="Key not configured")
    text = clean_for_tts(req.text)[:4000]
    if not text:
        raise HTTPException(status_code=400, detail="Empty text")
    engine = OpenAITextToSpeech(api_key=EMERGENT_LLM_KEY)
    try:
        audio_bytes = await engine.generate_speech(text=text, model="tts-1",
                                                   voice=req.voice or "onyx",
                                                   response_format="mp3")
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail="Speech generation failed")
    return Response(content=audio_bytes, media_type="audio/mpeg",
                    headers={"Cache-Control": "no-cache"})


# ---------------- Forms ----------------
@api_router.post("/intake")
async def submit_intake(payload: IntakeSubmit):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.intakes.insert_one({**doc})
    return {"ok": True, "id": doc["id"]}


@api_router.post("/contact")
async def submit_contact(payload: ContactSubmit):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one({**doc})
    return {"ok": True, "id": doc["id"]}


@api_router.post("/meeting")
async def submit_meeting(payload: MeetingSubmit):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.meetings.insert_one({**doc})
    return {"ok": True, "id": doc["id"]}


@api_router.get("/advisor/state")
async def get_advisor_state(session_token: Optional[str] = Cookie(None),
                            authorization: Optional[str] = Header(None)):
    user = await get_current_user(session_token, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    state = await db.advisor_states.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not state:
        return {"messages": [], "intake": {}, "canvas": {}, "interactive": {}}
    return {"messages": state.get("messages", []), "intake": state.get("intake", {}),
            "canvas": state.get("canvas", {}), "interactive": state.get("interactive", {})}


@api_router.post("/advisor/state")
async def save_advisor_state(payload: AdvisorState, session_token: Optional[str] = Cookie(None),
                             authorization: Optional[str] = Header(None)):
    user = await get_current_user(session_token, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.advisor_states.update_one(
        {"user_id": user["user_id"]},
        {"$set": {
            "user_id": user["user_id"],
            "messages": payload.messages[-40:],
            "intake": payload.intake,
            "canvas": payload.canvas,
            "interactive": payload.interactive,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    return {"ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
