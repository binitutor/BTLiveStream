const { pool } = require('../config/database');

class Session {
  static async create(sessionData) {
    const { sessionId, hostId, title, description, roomCode, scheduledAt, maxParticipants } = sessionData;
    const query = `
      INSERT INTO livestream_sessions 
      (session_id, host_id, title, description, room_code, scheduled_at, max_participants)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      sessionId, hostId, title, description, roomCode, scheduledAt, maxParticipants
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT s.*, u.name as host_name, u.email as host_email 
      FROM livestream_sessions s
      LEFT JOIN users u ON s.host_id = u.id
      WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findBySessionId(sessionId) {
    const query = `
      SELECT s.*, u.name as host_name, u.email as host_email 
      FROM livestream_sessions s
      LEFT JOIN users u ON s.host_id = u.id
      WHERE s.session_id = $1
    `;
    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  static async findByRoomCode(roomCode) {
    const query = 'SELECT * FROM livestream_sessions WHERE room_code = $1';
    const result = await pool.query(query, [roomCode]);
    return result.rows[0];
  }

  static async getByHostId(hostId) {
    const query = `
      SELECT * FROM livestream_sessions 
      WHERE host_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [hostId]);
    return result.rows;
  }

  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT s.*, u.name as host_name, u.email as host_email,
      (SELECT COUNT(*) FROM session_participants WHERE session_id = s.id AND is_active = true) as active_participants
      FROM livestream_sessions s
      LEFT JOIN users u ON s.host_id = u.id
      ORDER BY s.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE livestream_sessions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async startSession(id) {
    const query = `
      UPDATE livestream_sessions 
      SET status = 'live', started_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async endSession(id) {
    const query = `
      UPDATE livestream_sessions 
      SET status = 'ended', ended_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async addParticipant(sessionId, userId) {
    const query = `
      INSERT INTO session_participants (session_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (session_id, user_id) 
      DO UPDATE SET is_active = true, joined_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [sessionId, userId]);
    return result.rows[0];
  }

  static async removeParticipant(sessionId, userId) {
    const query = `
      UPDATE session_participants 
      SET is_active = false, left_at = CURRENT_TIMESTAMP 
      WHERE session_id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [sessionId, userId]);
    return result.rows[0];
  }

  static async getParticipants(sessionId) {
    const query = `
      SELECT sp.*, u.name, u.email 
      FROM session_participants sp
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE sp.session_id = $1 AND sp.is_active = true
      ORDER BY sp.joined_at DESC
    `;
    const result = await pool.query(query, [sessionId]);
    return result.rows;
  }
}

module.exports = Session;
