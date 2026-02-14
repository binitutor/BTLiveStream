# BTLiveStream Setup Guide

## Complete Setup Instructions

### Step 1: Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from: https://www.postgresql.org/download/windows/

### Step 2: Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE btlivestream;
CREATE USER btlive_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE btlivestream TO btlive_user;

# Exit psql
\q
```

### Step 3: Configure Environment Variables

1. **Backend Configuration**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=btlive_user
DB_PASSWORD=your_secure_password
DB_NAME=btlivestream

JWT_SECRET=your_random_secure_string_min_32_characters
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

2. **Frontend Configuration**
```bash
cp .env.react.example .env.local
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Initialize Database

```bash
npm run db:init
```

This will create all necessary tables:
- users
- livestream_sessions
- session_participants
- call_analytics
- support_tickets
- support_responses

### Step 6: Run the Application

#### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```

#### Option 2: Run Separately
Terminal 1 (Backend):
```bash
npm run server:dev
```

Terminal 2 (Frontend):
```bash
npm start
```

### Step 7: Verify Installation

1. **Check Backend Health**
Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "BTLiveStream API is running"
}
```

2. **Check Frontend**
Open browser: http://localhost:3000

## Quick Start - Test the API

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### 3. Create a Session
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Livestream",
    "description": "Testing the system",
    "maxParticipants": 50
  }'
```

## Using the API in React

Import the API utilities in your components:

```javascript
import { authAPI, sessionsAPI, analyticsAPI, supportAPI } from './api';

// Example: Login
const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    localStorage.setItem('btls_token', response.token);
    localStorage.setItem('btls_user', JSON.stringify(response.user));
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Example: Create Session
const createSession = async (title, description) => {
  try {
    const response = await sessionsAPI.create({
      title,
      description,
      maxParticipants: 100
    });
    console.log('Session created:', response.session);
  } catch (error) {
    console.error('Failed to create session:', error.message);
  }
};

// Example: Track Analytics
const trackAnalytics = async (sessionId, eventType) => {
  try {
    await analyticsAPI.track({
      sessionId,
      eventType,
      videoQuality: '1080p',
      bandwidthKbps: 3000,
      latencyMs: 50
    });
  } catch (error) {
    console.error('Failed to track analytics:', error.message);
  }
};

// Example: Create Support Ticket
const createTicket = async (subject, description) => {
  try {
    const response = await supportAPI.createTicket({
      subject,
      description,
      category: 'technical',
      priority: 'medium'
    });
    console.log('Ticket created:', response.ticket);
  } catch (error) {
    console.error('Failed to create ticket:', error.message);
  }
};
```

## Project Structure

```
BTLiveStream/
├── server.js                    # Main server entry point
├── package.json                 # Dependencies and scripts
├── .env                         # Backend environment variables (create from .env.example)
├── .env.local                   # Frontend environment variables (create from .env.react.example)
├── BACKEND_README.md           # Backend API documentation
├── SETUP_GUIDE.md              # This file
│
├── config/
│   └── database.js             # PostgreSQL configuration
│
├── models/
│   ├── User.js                 # User data model
│   ├── Session.js              # Session data model
│   ├── Analytics.js            # Analytics data model
│   └── SupportTicket.js        # Support ticket data model
│
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── sessionController.js    # Session management logic
│   ├── analyticsController.js  # Analytics logic
│   └── supportController.js    # Support ticket logic
│
├── routes/
│   ├── auth.js                 # Auth routes
│   ├── sessions.js             # Session routes
│   ├── analytics.js            # Analytics routes
│   └── support.js              # Support routes
│
├── middleware/
│   └── auth.js                 # JWT authentication middleware
│
├── scripts/
│   └── initDatabase.js         # Database initialization script
│
├── src/                        # React frontend
│   ├── App.js
│   ├── index.js
│   ├── api/
│   │   └── index.js           # API utility functions
│   └── components/
│       ├── Auth.js
│       ├── Dashboard.js
│       ├── Sessions.js
│       └── Support.js
│
└── public/
    └── index.html
```

## Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Check if PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Verify database credentials in `.env`
- Test connection: `psql -U btlive_user -d btlivestream`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in `.env` to a different value (e.g., 5001)
- Or kill the process using the port: `lsof -ti:5000 | xargs kill`

### JWT Token Errors
```
Error: Invalid or expired token
```
**Solution:**
- Ensure JWT_SECRET is set in `.env`
- Check if token is being sent in Authorization header
- Token might be expired, login again to get a new token

### CORS Errors
```
Access to fetch has been blocked by CORS policy
```
**Solution:**
- Ensure backend is running on port 5000
- Check that proxy is set in package.json
- Verify CLIENT_URL in backend `.env` matches your frontend URL

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
- Run `npm install` to install all dependencies
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Development Tips

### Using Postman or Thunder Client
Import these endpoints to test the API:
- Base URL: `http://localhost:5000/api`
- Add header: `Authorization: Bearer YOUR_TOKEN` for protected routes

### Database Management
View tables:
```bash
psql -U btlive_user -d btlivestream
\dt  # List tables
\d users  # Describe users table
SELECT * FROM users;  # View user data
```

### Reset Database
```bash
# Drop and recreate database
psql postgres
DROP DATABASE btlivestream;
CREATE DATABASE btlivestream;
\q

# Reinitialize tables
npm run db:init
```

## Production Deployment

### Environment Variables
Update `.env` for production:
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=very_long_random_secure_string_for_production
CLIENT_URL=https://your-domain.com
```

### Security Checklist
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Use HTTPS in production
- [ ] Set strong database passwords
- [ ] Enable rate limiting
- [ ] Use environment variables for all sensitive data
- [ ] Enable PostgreSQL SSL connections
- [ ] Implement proper logging
- [ ] Set up database backups

## Support

For issues or questions:
1. Check the BACKEND_README.md for API documentation
2. Review error logs in the terminal
3. Check PostgreSQL logs: `tail -f /usr/local/var/log/postgres.log` (macOS)

## Next Steps

1. ✅ Complete the setup above
2. Test API endpoints with curl or Postman
3. Integrate API calls in React components
4. Add WebRTC functionality for video streaming
5. Implement real-time features with Socket.io (optional)
6. Add email notifications for support tickets
7. Implement admin dashboard
8. Deploy to production

Good luck with your BTLiveStream application! 🚀
