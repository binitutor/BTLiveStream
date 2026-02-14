BT Live Stream Frontend
=======================

Overview
--------
BT Live Stream is a responsive, light-themed frontend for a peer-to-peer live video call platform. The UI is built with Bootstrap 5.3 and includes SweetAlert2 notifications, DataTables for session management, and ChartJS analytics.

Key Features
------------
- Responsive layout optimized for mobile and desktop.
- Light color palette with primary #234756 and secondary #C66F3D.
- Live session analytics with ChartJS.
- Session management table with DataTables search and paging.
- SweetAlert2 notifications for actions and errors.
- WebRTC-powered local webcam preview and session controls.

Libraries
---------
- Bootstrap 5.3
- SweetAlert2
- DataTables (Bootstrap 5 integration)
- ChartJS

Files
-----
- index.html
- styles.css
- script.js

How to View
-----------
Open [BTLiveStream/index.html](BTLiveStream/index.html) in your browser.

Webcam Notes
------------
- The live preview uses WebRTC getUserMedia.
- You will be prompted for camera and microphone permissions.
- If permissions are blocked, allow them in the browser settings and retry.

Backend (Node.js + PostgreSQL)
------------------------------
The backend API lives in [BTLiveStream/server](BTLiveStream/server) and provides authentication and session management.

Setup
-----
1. Create a PostgreSQL database named btlivestream.
2. Run the schema in [BTLiveStream/server/sql/schema.sql](BTLiveStream/server/sql/schema.sql).
3. Copy [BTLiveStream/server/.env.example](BTLiveStream/server/.env.example) to .env and update values.
4. Install dependencies and start the API:
	- npm install
	- npm run dev

API Endpoints
-------------
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/request-verification
- POST /api/auth/verify-email
- POST /api/auth/request-password-reset
- POST /api/auth/reset-password
- POST /api/sessions (auth required)
- GET /api/sessions/mine (auth required)
- GET /api/sessions/:roomId

Frontend Auth Flow
------------------
- New users sign up in the Account section.
- A verification token is issued (demo) and must be confirmed before login.
- Password reset issues a token (demo) used to set a new password.
- Logged-in users can create sessions.
- Anyone with a Room ID can join a session.

Minimal WebRTC Signaling Server
-------------------------------
The API includes a lightweight WebSocket signaling server at /ws.

Message Types
-------------
- { "type": "join", "roomId": "BT-XXXX-YYYY" }
- { "type": "signal", "roomId": "BT-XXXX-YYYY", "payload": { ... } }
- { "type": "leave" }

Deployment
----------
For production deployment to Heroku, see [HEROKU_DEPLOYMENT.md](HEROKU_DEPLOYMENT.md).

The project is configured with:
- Procfile for Heroku process management
- Automatic database initialization on deployment
- React static file serving from Express
- Environment variable configuration for Heroku PostgreSQL
