# J A Fell & Co — Product Requirements Document

## Original Problem Statement
Build a website for J A Fell & Co, a Chartered Accountancy firm in Southport, UK (40 Hoghton Street, PR9 0PQ, phone 01704 500299). Dual mode: a static marketing site (Home, Services, About, Contact) PLUS a dynamic AI mode where a chat assistant sits on the right and a canvas on the left changes in real time based on the conversation (service info, auto-filling intake form, team info, quote). Includes Google login, voice chat (speak & listen), and smooth animations.

## User Choices
- Theme: Deep navy (#0B132B/#1C2541) + gold (#D4AF37)
- Chat LLM: Claude Sonnet 4.6 (via Emergent Universal Key)
- Voice: OpenAI Whisper (STT) + OpenAI TTS ("onyx"), Universal Key
- Auth: Emergent-managed Google OAuth
- Intake fields: business name, contact person, turnover, service interested in, current accountant

## Architecture
- Frontend: React 19 + React Router, Tailwind, framer-motion, sonner, lucide-react. Fonts: Cormorant Garamond (headings), Outfit (body), JetBrains Mono (numbers).
- Backend: FastAPI, motor/MongoDB. All routes under /api.
- Integrations: emergentintegrations LlmChat (anthropic/claude-sonnet-4-6), OpenAISpeechToText (whisper-1), OpenAITextToSpeech (tts-1). EMERGENT_LLM_KEY in backend/.env.

## Implemented (2026-06 — MVP)
- Static site: Home (hero, services grid, why-us, testimonials, CTA), Services, About (story/values/team), Contact (form + Google Map + details). Navbar/Footer, animations.
- AI Advisory mode (/ai): split layout — DynamicCanvas (left) + ChatPanel (right).
  - Canvas views: welcome, service, team, quote, intake (auto-filling form with live green-check indicators + submit).
  - Chat: Claude Sonnet 4.6, structured JSON output (reply + canvas + intake), typing indicator, message history.
  - Voice: mic record -> /api/voice/transcribe (Whisper); TTS playback via /api/voice/tts with animated waveform + status badges (Listening/Transcribing/Thinking/Speaking); audio mute toggle.
  - Deterministic guarantee: intake form is shown when client details are first captured.
- Auth: Emergent Google OAuth (/api/auth/session|me|logout), httpOnly cookie + Bearer fallback, user pill in AI header.
- Forms: /api/intake and /api/contact persist to MongoDB.
- Tested: backend 100% (9 pytest), frontend 95%+ (all flows verified incl. intake auto-fill).

## Implemented (2026-09 update — Interactive canvas + accuracy)
- AI canvas now has 6 NEW bi-directional interactive views (AI picks per message, actions send messages back to Fiona):
  - service_tiles (tap-to-ask), pain_points (multi-select), fee_slider (live £ estimate), package_builder (basket + running total), roi (time/money reclaimed), comparison (flip card).
  - Selections (turnover band, pain points, package, roi hours) persist for signed-in users via AdvisorState.interactive (GET/POST /api/advisor/state).
  - Animated transitions via AnimatePresence mode="wait". Tested 10/10 (iteration_4.json).
- REMOVED the "team" canvas view and the "Who would I work with?" suggestion chip. Asking about the team now yields a factual text reply about Oliver Grills only (canvas stays on welcome/service_tiles). TeamView returns null.
- System prompt hardened with STRICT ACCURACY / no-hallucination guardrails: only stated facts; never invent founding dates, experience, client/staff counts, awards, colleagues, testimonials, or guaranteed tax figures; fees always indicative.

## Backlog
- P1: Financial Advisers dedicated page (niche pain points + free guide download).
- P1: Calendly inline embed (calendly.com/olivergrills/discovery-call) inside AI scheduler.
- P2: Real client testimonials (replace placeholders once provided).
- P2: Free guide lead magnet ("7 ways to keep more of what you earn") with email capture.
- P2: Email notification on intake/contact/meeting submissions (Resend/SendGrid).
- P2: Admin view of submitted intakes/contacts/leads (incl. interactive selections).

## Next Tasks
- Await user direction; likely Financial Advisers page or Calendly embed next.
