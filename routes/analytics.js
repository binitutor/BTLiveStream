const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Track analytics
router.post('/track', analyticsController.trackEvent);
router.post('/batch-track', analyticsController.batchTrackEvents);

// Get analytics
router.get('/session/:sessionId', analyticsController.getSessionAnalytics);
router.get('/session/:sessionId/stats', analyticsController.getSessionStats);
router.get('/user', analyticsController.getUserAnalytics);

module.exports = router;
