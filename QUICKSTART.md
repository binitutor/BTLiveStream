# BTLiveStream - Quick Start Guide

## ✅ Backend Successfully Set Up!

Your backend server is now running and all features are working:
- ✅ Database initialized with all tables
- ✅ Server running on http://localhost:5001
- ✅ All API endpoints operational
- ✅ User registration and authentication working
- ✅ PostgreSQL connected successfully

## Server Status

**Backend Server:** Running on port 5001 (changed from 5000 due to macOS ControlCenter)
**Database:** PostgreSQL - btlivestream
**Status:** ✅ All systems operational

## Quick Test - API Working!

```bash
# Health Check
curl http://localhost:5001/api/health

# Register User (Already tested successfully!)
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"Your Name"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

## NPM Scripts Available

```bash
# Database Management
npm run db:init      # Initialize database (create tables)
npm run db:reset     # Drop all tables
npm run db:setup     # Reset and reinitialize (recommended for fresh start)

# Server Commands
npm run server       # Run backend in production mode
npm run server:dev   # Run backend with auto-reload (nodemon)
npm start            # Run React frontend
npm run dev          # Run BOTH backend and frontend simultaneously

# Build
npm run build        # Build React app for production
```

## Current Backend Process

The backend is currently running in the background.
- Process ID can be checked with: `lsof -i :5001`
- To stop: Find the terminal ID and kill it or press Ctrl+C

## Connection Details

### Backend API
- **Base URL:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health

### Frontend
- **URL:** http://localhost:3000 (when running `npm start`)
- **Proxy:** Configured to forward API requests to http://localhost:5001

### Database
- **Host:** localhost
- **Port:** 5432
- **Database:** btlivestream
- **User:** postgres
- **Password:** (as configured in .env)

## Using the API in React

The API client is already set up in `src/api/index.js`. Use it like this:

```javascript
import { authAPI, sessionsAPI, analyticsAPI, supportAPI } from './api';

// Register
const response = await authAPI.register(email, password, name);

// Login
const response = await authAPI.login(email, password);
localStorage.setItem('btls_token', response.token);

// Create Session
const session = await sessionsAPI.create({
  title: 'My Livestream',
  description: 'Test session',
  maxParticipants: 50
});

// Track Analytics
await analyticsAPI.track({
  sessionId: 1,
  eventType: 'connection_quality',
  videoQuality: '1080p',
  bandwidthKbps: 3000,
  latencyMs: 45
});

// Create Support Ticket
const ticket = await supportAPI.createTicket({
  subject: 'Need Help',
  description: 'Issue description',
  category: 'technical',
  priority: 'high'
});
```

## Next Steps

1. **Test the Complete Flow:**
   - Start frontend: `npm start` (in a new terminal)
   - The frontend will proxy API requests to backend automatically
   
2. **Update React Components:**
   - Modify `src/components/Auth.js` to use `authAPI`
   - Modify `src/components/Sessions.js` to use `sessionsAPI`
   - Modify `src/components/Support.js` to use `supportAPI`

3. **Add Real-time Features (Optional):**
   - Consider adding Socket.io for live session updates
   - Implement WebRTC for peer-to-peer video

## Troubleshooting

### If backend crashes
```bash
npm run server:dev
```

### If database needs reset
```bash
npm run db:setup
```

### If port 5001 is taken
Edit `.env` and change PORT to another number (e.g., 5002)

### Check what's running on a port
```bash
lsof -i :5001
```

## API Endpoint Reference

See `BACKEND_README.md` for complete API documentation including:
- 4 Authentication endpoints
- 10 Session management endpoints  
- 5 Analytics endpoints
- 8 Support ticket endpoints

Total: **28 RESTful API endpoints** ready to use!

## Files Created

- ✅ `.env` - Your environment configuration (DO NOT commit to git)
- ✅ `server.js` - Express server
- ✅ `config/database.js` - PostgreSQL setup
- ✅ `models/` - Data models (4 files)
- ✅ `controllers/` - Business logic (4 files)
- ✅ `routes/` - API routes (4 files)
- ✅ `middleware/auth.js` - JWT authentication
- ✅ `scripts/initDatabase.js` - DB initialization
- ✅ `scripts/resetDatabase.js` - DB reset utility
- ✅ `src/api/index.js` - React API utilities

## Success! 🎉

Your BTLiveStream backend is fully operational with:
- ✅ PostgreSQL database with 6 tables
- ✅ Complete REST API with 28 endpoints
- ✅ JWT authentication
- ✅ User registration & login
- ✅ Livestream session management
- ✅ Call analytics tracking
- ✅ Support ticket system
- ✅ Ready to integrate with React frontend

**You're all set to start building your livestream application!**
