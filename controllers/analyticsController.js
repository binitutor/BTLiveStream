const Analytics = require('../models/Analytics');
const Session = require('../models/Session');

// Track analytics event
exports.trackEvent = async (req, res) => {
  try {
    const {
      sessionId,
      eventType,
      eventData,
      videoQuality,
      audioQuality,
      connectionType,
      bandwidthKbps,
      latencyMs,
      packetLossPercentage
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!sessionId || !eventType) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and event type are required'
      });
    }

    const analyticsData = {
      sessionId,
      userId,
      eventType,
      eventData,
      videoQuality,
      audioQuality,
      connectionType,
      bandwidthKbps: bandwidthKbps ? parseInt(bandwidthKbps) : null,
      latencyMs: latencyMs ? parseInt(latencyMs) : null,
      packetLossPercentage: packetLossPercentage ? parseFloat(packetLossPercentage) : null
    };

    const analytics = await Analytics.track(analyticsData);

    res.status(201).json({
      success: true,
      message: 'Analytics event tracked successfully',
      analytics
    });
  } catch (error) {
    console.error('Track analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking analytics',
      error: error.message
    });
  }
};

// Get session analytics
exports.getSessionAnalytics = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const analytics = await Analytics.getSessionAnalytics(sessionId);

    res.json({
      success: true,
      count: analytics.length,
      analytics
    });
  } catch (error) {
    console.error('Get session analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session analytics',
      error: error.message
    });
  }
};

// Get session statistics
exports.getSessionStats = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const stats = await Analytics.getSessionStats(sessionId);
    const participants = await Session.getParticipants(sessionId);

    // Calculate session duration
    let duration = null;
    if (session.started_at) {
      const endTime = session.ended_at ? new Date(session.ended_at) : new Date();
      const startTime = new Date(session.started_at);
      duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds
    }

    res.json({
      success: true,
      stats: {
        ...stats,
        current_participants: participants.length,
        session_duration: duration,
        session_status: session.status
      }
    });
  } catch (error) {
    console.error('Get session stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session statistics',
      error: error.message
    });
  }
};

// Get user analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 100 } = req.query;

    const analytics = await Analytics.getUserAnalytics(userId, parseInt(limit));

    res.json({
      success: true,
      count: analytics.length,
      analytics
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics',
      error: error.message
    });
  }
};

// Batch track multiple events
exports.batchTrackEvents = async (req, res) => {
  try {
    const { events } = req.body;
    const userId = req.user.id;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Events array is required'
      });
    }

    const results = [];
    for (const event of events) {
      try {
        const analyticsData = {
          ...event,
          userId,
          bandwidthKbps: event.bandwidthKbps ? parseInt(event.bandwidthKbps) : null,
          latencyMs: event.latencyMs ? parseInt(event.latencyMs) : null,
          packetLossPercentage: event.packetLossPercentage ? parseFloat(event.packetLossPercentage) : null
        };
        
        const analytics = await Analytics.track(analyticsData);
        results.push({ success: true, analytics });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Tracked ${results.filter(r => r.success).length} of ${events.length} events`,
      results
    });
  } catch (error) {
    console.error('Batch track analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error batch tracking analytics',
      error: error.message
    });
  }
};
