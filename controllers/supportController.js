const SupportTicket = require('../models/SupportTicket');

// Create new support ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required'
      });
    }

    const ticketNumber = SupportTicket.generateTicketNumber();

    const ticketData = {
      ticketNumber,
      userId,
      subject,
      description,
      category: category || 'general',
      priority: priority || 'medium'
    };

    const ticket = await SupportTicket.create(ticketData);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating support ticket',
      error: error.message
    });
  }
};

// Get all tickets (with pagination)
exports.getAllTickets = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const tickets = await SupportTicket.getAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message
    });
  }
};

// Get ticket by ID
exports.getTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Get ticket responses
    const responses = await SupportTicket.getResponses(id);

    res.json({
      success: true,
      ticket,
      responses
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
};

// Get ticket by ticket number
exports.getTicketByNumber = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const ticket = await SupportTicket.findByTicketNumber(ticketNumber);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Get ticket responses
    const responses = await SupportTicket.getResponses(ticket.id);

    res.json({
      success: true,
      ticket,
      responses
    });
  } catch (error) {
    console.error('Get ticket by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
};

// Get user's tickets
exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await SupportTicket.getByUserId(userId);

    res.json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user tickets',
      error: error.message
    });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['open', 'in_progress', 'pending', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const ticket = await SupportTicket.updateStatus(id, status);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticket status',
      error: error.message
    });
  }
};

// Add response to ticket
exports.addResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const response = await SupportTicket.addResponse(id, userId, message, false);

    res.status(201).json({
      success: true,
      message: 'Response added successfully',
      response
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding response',
      error: error.message
    });
  }
};

// Get ticket responses
exports.getTicketResponses = async (req, res) => {
  try {
    const { id } = req.params;
    const responses = await SupportTicket.getResponses(id);

    res.json({
      success: true,
      count: responses.length,
      responses
    });
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching responses',
      error: error.message
    });
  }
};
