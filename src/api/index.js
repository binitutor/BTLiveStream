// API configuration and helper functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('btls_token');
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Authentication API
export const authAPI = {
  register: async (email, password, name) => {
    return authenticatedFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: async (email, password) => {
    return authenticatedFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async () => {
    return authenticatedFetch(`${API_BASE_URL}/auth/profile`);
  },

  verifyToken: async () => {
    return authenticatedFetch(`${API_BASE_URL}/auth/verify`);
  },
};

// Sessions API
export const sessionsAPI = {
  create: async (sessionData) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  getAll: async (limit = 50, offset = 0) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions?limit=${limit}&offset=${offset}`);
  },

  getMySessions: async () => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/my-sessions`);
  },

  getById: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/${id}`);
  },

  getByRoomCode: async (roomCode) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/room/${roomCode}`);
  },

  start: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/${id}/start`, {
      method: 'POST',
    });
  },

  end: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/${id}/end`, {
      method: 'POST',
    });
  },

  join: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/${id}/join`, {
      method: 'POST',
    });
  },

  leave: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/${id}/leave`, {
      method: 'POST',
    });
  },

  getParticipants: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/sessions/${id}/participants`);
  },
};

// Analytics API
export const analyticsAPI = {
  track: async (eventData) => {
    return authenticatedFetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  batchTrack: async (events) => {
    return authenticatedFetch(`${API_BASE_URL}/analytics/batch-track`, {
      method: 'POST',
      body: JSON.stringify({ events }),
    });
  },

  getSessionAnalytics: async (sessionId) => {
    return authenticatedFetch(`${API_BASE_URL}/analytics/session/${sessionId}`);
  },

  getSessionStats: async (sessionId) => {
    return authenticatedFetch(`${API_BASE_URL}/analytics/session/${sessionId}/stats`);
  },

  getUserAnalytics: async (limit = 100) => {
    return authenticatedFetch(`${API_BASE_URL}/analytics/user?limit=${limit}`);
  },
};

// Support API
export const supportAPI = {
  createTicket: async (ticketData) => {
    return authenticatedFetch(`${API_BASE_URL}/support`, {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  getAll: async (limit = 50, offset = 0) => {
    return authenticatedFetch(`${API_BASE_URL}/support?limit=${limit}&offset=${offset}`);
  },

  getMyTickets: async () => {
    return authenticatedFetch(`${API_BASE_URL}/support/my-tickets`);
  },

  getById: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/support/${id}`);
  },

  getByTicketNumber: async (ticketNumber) => {
    return authenticatedFetch(`${API_BASE_URL}/support/number/${ticketNumber}`);
  },

  updateStatus: async (id, status) => {
    return authenticatedFetch(`${API_BASE_URL}/support/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  addResponse: async (id, message) => {
    return authenticatedFetch(`${API_BASE_URL}/support/${id}/responses`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  getResponses: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/support/${id}/responses`);
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default {
  authAPI,
  sessionsAPI,
  analyticsAPI,
  supportAPI,
  healthCheck,
};
