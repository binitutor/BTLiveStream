# BTLiveStream Backend API

## Overview
Node.js/Express backend with PostgreSQL database for the BTLiveStream application.

## Features
- ✅ User registration and authentication (JWT)
- ✅ Livestream session management
- ✅ Real-time call analytics tracking
- ✅ Support ticket system
- ✅ PostgreSQL database integration
- ✅ Secure password hashing with bcrypt
- ✅ RESTful API endpoints

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database
Create a new PostgreSQL database:
```sql
CREATE DATABASE btlivestream;
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (use `.env.example` as template):
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=btlivestream

JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

### 4. Initialize Database Tables
```bash
npm run db:init
```

## Running the Application

### Development Mode
Run backend and frontend concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Backend only
npm run server:dev

# Frontend only (in another terminal)
npm start
```

### Production Mode
```bash
npm run server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/verify` - Verify JWT token (protected)

### Sessions
- `POST /api/sessions` - Create new session (protected)
- `GET /api/sessions` - Get all sessions (protected)
- `GET /api/sessions/my-sessions` - Get user's hosted sessions (protected)
- `GET /api/sessions/:id` - Get session by ID (protected)
- `GET /api/sessions/room/:roomCode` - Get session by room code (protected)
- `POST /api/sessions/:id/start` - Start session (protected)
- `POST /api/sessions/:id/end` - End session (protected)
- `POST /api/sessions/:id/join` - Join session (protected)
- `POST /api/sessions/:id/leave` - Leave session (protected)
- `GET /api/sessions/:id/participants` - Get session participants (protected)

### Analytics
- `POST /api/analytics/track` - Track single analytics event (protected)
- `POST /api/analytics/batch-track` - Batch track multiple events (protected)
- `GET /api/analytics/session/:sessionId` - Get session analytics (protected)
- `GET /api/analytics/session/:sessionId/stats` - Get session statistics (protected)
- `GET /api/analytics/user` - Get user analytics (protected)

### Support
- `POST /api/support` - Create support ticket (protected)
- `GET /api/support` - Get all tickets (protected)
- `GET /api/support/my-tickets` - Get user's tickets (protected)
- `GET /api/support/:id` - Get ticket by ID (protected)
- `GET /api/support/number/:ticketNumber` - Get ticket by number (protected)
- `PATCH /api/support/:id/status` - Update ticket status (protected)
- `POST /api/support/:id/responses` - Add response to ticket (protected)
- `GET /api/support/:id/responses` - Get ticket responses (protected)

### Health Check
- `GET /api/health` - Health check endpoint

## Database Schema

### Tables
1. **users** - User accounts
2. **livestream_sessions** - Livestream session information
3. **session_participants** - Session participant tracking
4. **call_analytics** - Call quality and analytics data
5. **support_tickets** - Support ticket information
6. **support_responses** - Support ticket responses

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Example API Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Create Session
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My Livestream",
    "description": "This is a test session",
    "maxParticipants": 50
  }'
```

### Track Analytics
```bash
curl -X POST http://localhost:5000/api/analytics/track \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sessionId": 1,
    "eventType": "video_quality_change",
    "videoQuality": "720p",
    "bandwidthKbps": 2500,
    "latencyMs": 45
  }'
```

### Create Support Ticket
```bash
curl -X POST http://localhost:5000/api/support \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subject": "Connection Issue",
    "description": "Unable to connect to session",
    "category": "technical",
    "priority": "high"
  }'
```

## Error Handling
All endpoints return JSON responses with the following structure:
```json
{
  "success": true/false,
  "message": "Description of result",
  "data": {} // or error details
}
```

## Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- SQL injection prevention with parameterized queries
- CORS enabled for frontend integration
- Environment variable configuration

## Project Structure
```
├── server.js                 # Main server file
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── User.js              # User model
│   ├── Session.js           # Session model
│   ├── Analytics.js         # Analytics model
│   └── SupportTicket.js     # Support ticket model
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── sessionController.js # Session management logic
│   ├── analyticsController.js # Analytics logic
│   └── supportController.js # Support ticket logic
├── routes/
│   ├── auth.js              # Auth routes
│   ├── sessions.js          # Session routes
│   ├── analytics.js         # Analytics routes
│   └── support.js           # Support routes
├── middleware/
│   └── auth.js              # Authentication middleware
└── scripts/
    └── initDatabase.js      # Database initialization script
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE btlivestream;`

### Port Already in Use
Change the PORT in `.env` file to a different value

### JWT Token Errors
- Ensure JWT_SECRET is set in `.env`
- Check token expiration time

## License
MIT
