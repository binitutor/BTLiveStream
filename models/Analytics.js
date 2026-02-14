const { pool } = require('../config/database');

class Analytics {
  static async track(analyticsData) {
    const {
      sessionId,
      userId,
      eventType,
      eventData,
      videoQuality,
      audioQuality,
      connectionType,
      bandwidthKbps,
      latencyMs,
      packetLossPercentage
    } = analyticsData;

    const query = `
      INSERT INTO call_analytics 
      (session_id, user_id, event_type, event_data, video_quality, audio_quality, 
       connection_type, bandwidth_kbps, latency_ms, packet_loss_percentage)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      sessionId, userId, eventType, eventData ? JSON.stringify(eventData) : null,
      videoQuality, audioQuality, connectionType, bandwidthKbps, latencyMs, packetLossPercentage
    ]);
    
    return result.rows[0];
  }

  static async getSessionAnalytics(sessionId) {
    const query = `
      SELECT ca.*, u.name as user_name, u.email as user_email
      FROM call_analytics ca
      LEFT JOIN users u ON ca.user_id = u.id
      WHERE ca.session_id = $1
      ORDER BY ca.timestamp DESC
    `;
    const result = await pool.query(query, [sessionId]);
    return result.rows;
  }

  static async getSessionStats(sessionId) {
    const query = `
      SELECT 
        COUNT(DISTINCT user_id) as unique_users,
        AVG(bandwidth_kbps) as avg_bandwidth,
        AVG(latency_ms) as avg_latency,
        AVG(packet_loss_percentage) as avg_packet_loss,
        COUNT(*) as total_events
      FROM call_analytics
      WHERE session_id = $1
    `;
    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  static async getUserAnalytics(userId, limit = 100) {
    const query = `
      SELECT * FROM call_analytics
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }
}

module.exports = Analytics;
