const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Ticket management
router.post('/', supportController.createTicket);
router.get('/', supportController.getAllTickets);
router.get('/my-tickets', supportController.getUserTickets);
router.get('/:id', supportController.getTicket);
router.get('/number/:ticketNumber', supportController.getTicketByNumber);
router.patch('/:id/status', supportController.updateTicketStatus);

// Ticket responses
router.post('/:id/responses', supportController.addResponse);
router.get('/:id/responses', supportController.getTicketResponses);

module.exports = router;
