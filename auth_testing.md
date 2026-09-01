# Auth-Gated App Testing Playbook (Emergent Google OAuth)

DB name is read from backend/.env DB_NAME (default: test_database).

## Step 1: Create Test User & Session
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({ user_id: userId, email: 'test.user.' + Date.now() + '@example.com', name: 'Test User', picture: 'https://via.placeholder.com/150', created_at: new Date().toISOString() });
db.user_sessions.insertOne({ user_id: userId, session_token: sessionToken, expires_at: new Date(Date.now()+7*24*60*60*1000).toISOString(), created_at: new Date().toISOString() });
print('Session token: ' + sessionToken);
"

## Step 2: Test Backend
curl -X GET "$API_URL/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"

## Step 3: Browser
Set cookie session_token (httpOnly, secure, sameSite None, path /) then navigate to /ai.

## Endpoints
- POST /api/auth/session { session_id }
- GET  /api/auth/me
- POST /api/auth/logout
- POST /api/chat { session_id, message, history[], intake{} } -> { reply, canvas{view,data}, intake{} }
- POST /api/voice/transcribe (multipart file) -> { text }
- POST /api/voice/tts { text, voice } -> audio/mpeg bytes
- POST /api/intake, POST /api/contact
