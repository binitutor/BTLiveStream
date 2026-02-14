const { pool } = require('../config/database');

class SupportTicket {
  static async create(ticketData) {
    const { ticketNumber, userId, subject, description, category, priority } = ticketData;
    const query = `
      INSERT INTO support_tickets (ticket_number, user_id, subject, description, category, priority)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      ticketNumber, userId, subject, description, category, priority || 'medium'
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT st.*, u.name as user_name, u.email as user_email
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      WHERE st.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByTicketNumber(ticketNumber) {
    const query = `
      SELECT st.*, u.name as user_name, u.email as user_email
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      WHERE st.ticket_number = $1
    `;
    const result = await pool.query(query, [ticketNumber]);
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const query = `
      SELECT * FROM support_tickets
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT st.*, u.name as user_name, u.email as user_email,
      (SELECT COUNT(*) FROM support_responses WHERE ticket_id = st.id) as response_count
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      ORDER BY st.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const resolvedAt = status === 'resolved' ? 'CURRENT_TIMESTAMP' : 'NULL';
    const query = `
      UPDATE support_tickets 
      SET status = $1, updated_at = CURRENT_TIMESTAMP, resolved_at = ${resolvedAt}
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async addResponse(ticketId, userId, message, isStaffResponse = false) {
    const query = `
      INSERT INTO support_responses (ticket_id, user_id, message, is_staff_response)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [ticketId, userId, message, isStaffResponse]);
    
    // Update ticket updated_at timestamp
    await pool.query('UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [ticketId]);
    
    return result.rows[0];
  }

  static async getResponses(ticketId) {
    const query = `
      SELECT sr.*, u.name as user_name, u.email as user_email
      FROM support_responses sr
      LEFT JOIN users u ON sr.user_id = u.id
      WHERE sr.ticket_id = $1
      ORDER BY sr.created_at ASC
    `;
    const result = await pool.query(query, [ticketId]);
    return result.rows;
  }

  static generateTicketNumber() {
    const prefix = 'BTLS';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

module.exports = SupportTicket;
