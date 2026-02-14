const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Session management
router.post('/', sessionController.createSession);
router.get('/', sessionController.getAllSessions);
router.get('/my-sessions', sessionController.getUserSessions);
router.get('/:id', sessionController.getSession);
router.get('/room/:roomCode', sessionController.getSessionByRoomCode);

// Session actions
router.post('/:id/start', sessionController.startSession);
router.post('/:id/end', sessionController.endSession);
router.post('/:id/join', sessionController.joinSession);
router.post('/:id/leave', sessionController.leaveSession);

// Participants
router.get('/:id/participants', sessionController.getSessionParticipants);

module.exports = router;
