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

## Backlog
- P1: Meeting scheduler / document checklist canvas view.
- P1: Persist logged-in user's chat + intake progress server-side across sessions.
- P2: Fee calculator preview on marketing Home.
- P2: Explicit CORS origins for stricter cookie handling.
- P2: Admin view of submitted intakes/contacts.

## Next Tasks
- Await user feedback on branding/content, then extend AI canvas views and add scheduler.
