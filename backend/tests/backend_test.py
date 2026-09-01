"""Backend API tests for J A Fell & Co."""
import os
import io
import uuid
import time
import pytest
import requests
from pymongo import MongoClient
from datetime import datetime, timezone, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://jafell-accounting.preview.emergentagent.com').rstrip('/')
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def db():
    c = MongoClient(MONGO_URL)
    return c[DB_NAME]


@pytest.fixture(scope="session")
def session_token(db):
    token = f"test_session_{uuid.uuid4().hex}"
    user_id = f"test-user-{uuid.uuid4().hex}"
    email = f"TEST_{user_id}@example.com"
    db.users.insert_one({
        "user_id": user_id, "email": email, "name": "Test User",
        "picture": "", "created_at": datetime.now(timezone.utc).isoformat()
    })
    db.user_sessions.insert_one({
        "user_id": user_id, "session_token": token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    yield token, user_id, email
    db.user_sessions.delete_many({"session_token": token})
    db.users.delete_many({"user_id": user_id})


# ---------- Health ----------
def test_root_healthy():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


# ---------- Auth ----------
def test_auth_me_no_token():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_auth_me_with_token(session_token):
    token, user_id, email = session_token
    r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    d = r.json()
    assert d["user_id"] == user_id
    assert d["email"] == email


def test_auth_logout(db):
    token = f"test_session_{uuid.uuid4().hex}"
    user_id = f"test-user-{uuid.uuid4().hex}"
    db.users.insert_one({"user_id": user_id, "email": f"TEST_{user_id}@ex.com",
                         "name": "T", "created_at": datetime.now(timezone.utc).isoformat()})
    db.user_sessions.insert_one({
        "user_id": user_id, "session_token": token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    r = requests.post(f"{API}/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json().get("ok") is True
    # verify session removed
    r2 = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r2.status_code == 401
    db.users.delete_many({"user_id": user_id})


# ---------- Chat ----------
def test_chat_service_view():
    payload = {
        "session_id": f"test-{uuid.uuid4().hex[:8]}",
        "message": "Tell me about tax planning",
        "history": [],
        "intake": {}
    }
    r = requests.post(f"{API}/chat", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    d = r.json()
    assert isinstance(d.get("reply"), str) and len(d["reply"]) > 0
    assert "canvas" in d and isinstance(d["canvas"], dict)
    assert "view" in d["canvas"]
    assert d["canvas"]["view"] in ("welcome", "service", "intake", "team", "quote")
    assert "intake" in d and isinstance(d["intake"], dict)
    # Preferably 'service' for a tax planning question
    assert d["canvas"]["view"] == "service", f"Expected service, got {d['canvas']['view']}"


def test_chat_intake_capture():
    sid = f"test-{uuid.uuid4().hex[:8]}"
    payload = {
        "session_id": sid,
        "message": "Hi, I run Acme Widgets Ltd. Our turnover is about £850,000 and I'm interested in cloud accounting. My name is Jane Doe.",
        "history": [],
        "intake": {}
    }
    r = requests.post(f"{API}/chat", json=payload, timeout=60)
    assert r.status_code == 200
    d = r.json()
    intake = d.get("intake", {})
    # at least business_name should be captured
    bn = (intake.get("business_name") or "").lower()
    assert "acme" in bn, f"business_name not captured: {intake}"


# ---------- Voice TTS ----------
def test_tts_returns_audio():
    r = requests.post(f"{API}/voice/tts", json={"text": "Hello from J A Fell.", "voice": "onyx"}, timeout=60)
    assert r.status_code == 200, r.text
    assert r.headers.get("content-type", "").startswith("audio/mpeg")
    assert len(r.content) > 500


# ---------- Forms ----------
def test_intake_persistence(db):
    payload = {
        "business_name": "TEST_Biz",
        "contact_name": "TEST_Contact",
        "turnover": "500000",
        "service_interested": "Tax Planning",
        "current_accountant": "None",
        "email": "TEST_intake@example.com",
        "phone": "01704500299",
    }
    r = requests.post(f"{API}/intake", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["ok"] is True
    assert "id" in d
    found = db.intakes.find_one({"id": d["id"]})
    assert found is not None
    assert found["business_name"] == "TEST_Biz"
    db.intakes.delete_one({"id": d["id"]})


# ---------- Meeting (new) ----------
def test_meeting_persistence(db):
    payload = {
        "name": "TEST_Meeting",
        "email": "TEST_meeting@example.com",
        "phone": "01704500299",
        "mode": "office",
        "date": "2026-02-05",
        "time": "11:00",
        "notes": "TEST notes",
    }
    r = requests.post(f"{API}/meeting", json=payload)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["ok"] is True and "id" in d
    found = db.meetings.find_one({"id": d["id"]})
    assert found is not None
    assert found["mode"] == "office"
    assert found["date"] == "2026-02-05"
    db.meetings.delete_one({"id": d["id"]})


# ---------- Chat scheduler view (new) ----------
def test_chat_scheduler_view():
    payload = {
        "session_id": f"test-{uuid.uuid4().hex[:8]}",
        "message": "I would like to book a consultation please",
        "history": [],
        "intake": {},
    }
    r = requests.post(f"{API}/chat", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["canvas"]["view"] == "scheduler", f"Expected scheduler, got {d['canvas']['view']}"


# ---------- Advisor state (new, auth-gated) ----------
def test_advisor_state_requires_auth():
    r = requests.get(f"{API}/advisor/state")
    assert r.status_code == 401
    r2 = requests.post(f"{API}/advisor/state", json={"messages": [], "intake": {}, "canvas": {}})
    assert r2.status_code == 401


def test_advisor_state_get_defaults(session_token):
    token, user_id, _ = session_token
    # Ensure no state exists
    r = requests.get(f"{API}/advisor/state", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    d = r.json()
    assert "messages" in d and "intake" in d and "canvas" in d


def test_advisor_state_roundtrip(session_token, db):
    token, user_id, _ = session_token
    payload = {
        "messages": [{"role": "user", "content": "hi"}, {"role": "assistant", "content": "hello"}],
        "intake": {"business_name": "TEST_Acme"},
        "canvas": {"view": "intake", "data": {}},
    }
    r = requests.post(f"{API}/advisor/state", json=payload,
                      headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json().get("ok") is True

    r2 = requests.get(f"{API}/advisor/state", headers={"Authorization": f"Bearer {token}"})
    assert r2.status_code == 200
    d = r2.json()
    assert d["intake"].get("business_name") == "TEST_Acme"
    assert d["canvas"].get("view") == "intake"
    assert len(d["messages"]) == 2
    assert d["messages"][0]["content"] == "hi"
    # cleanup
    db.advisor_states.delete_many({"user_id": user_id})


def test_contact_persistence(db):
    payload = {
        "name": "TEST_Contact",
        "email": "TEST_contact@example.com",
        "phone": "01704500299",
        "message": "TEST message",
    }
    r = requests.post(f"{API}/contact", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["ok"] is True and "id" in d
    found = db.contacts.find_one({"id": d["id"]})
    assert found and found["message"] == "TEST message"
    db.contacts.delete_one({"id": d["id"]})
