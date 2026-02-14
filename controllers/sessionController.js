const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

// Generate random room code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create new livestream session
exports.createSession = async (req, res) => {
  try {
    const { title, description, scheduledAt, maxParticipants } = req.body;
    const hostId = req.user.id;

    // Validate input
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Session title is required'
      });
    }

    // Generate unique session ID and room code
    const sessionId = uuidv4();
    let roomCode = generateRoomCode();
    
    // Ensure room code is unique
    let existingSession = await Session.findByRoomCode(roomCode);
    while (existingSession) {
      roomCode = generateRoomCode();
      existingSession = await Session.findByRoomCode(roomCode);
    }

    const sessionData = {
      sessionId,
      hostId,
      title,
      description: description || '',
      roomCode,
      scheduledAt: scheduledAt || new Date(),
      maxParticipants: maxParticipants || 100
    };

    const session = await Session.create(sessionData);

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
};

// Get all sessions
exports.getAllSessions = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const sessions = await Session.getAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// Get session by ID
exports.getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

// Get session by room code
exports.getSessionByRoomCode = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const session = await Session.findByRoomCode(roomCode);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session by room code error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

// Get user's hosted sessions
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.getByHostId(userId);

    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user sessions',
      error: error.message
    });
  }
};

// Start session
exports.startSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is the host
    if (session.host_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can start the session'
      });
    }

    const updatedSession = await Session.startSession(id);

    res.json({
      success: true,
      message: 'Session started successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting session',
      error: error.message
    });
  }
};

// End session
exports.endSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is the host
    if (session.host_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can end the session'
      });
    }

    const updatedSession = await Session.endSession(id);

    res.json({
      success: true,
      message: 'Session ended successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending session',
      error: error.message
    });
  }
};

// Join session
exports.joinSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if session is live
    if (session.status !== 'live' && session.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Session is not available to join'
      });
    }

    await Session.addParticipant(id, userId);

    res.json({
      success: true,
      message: 'Joined session successfully',
      session
    });
  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining session',
      error: error.message
    });
  }
};

// Leave session
exports.leaveSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Session.removeParticipant(id, userId);

    res.json({
      success: true,
      message: 'Left session successfully'
    });
  } catch (error) {
    console.error('Leave session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving session',
      error: error.message
    });
  }
};

// Get session participants
exports.getSessionParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const participants = await Session.getParticipants(id);

    res.json({
      success: true,
      count: participants.length,
      participants
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching participants',
      error: error.message
    });
  }
};
