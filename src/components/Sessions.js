import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Sessions({ user }) {
  const [joinRoomId, setJoinRoomId] = useState('');
  const [createSessionData, setCreateSessionData] = useState({
    title: '',
    scheduledAt: '',
  });
  const [sessions, setSessions] = useState([
    {
      id: 1,
      room: 'BT-2014-Zeta',
      host: 'Amara Miles',
      date: 'Feb 08, 2026 10:30 AM',
      participants: 18,
      status: 'Scheduled',
      statusColor: 'success',
    },
    {
      id: 2,
      room: 'BT-7442-Delta',
      host: 'Khalid Ross',
      date: 'Feb 10, 2026 03:00 PM',
      participants: 32,
      status: 'Ready',
      statusColor: 'warning',
    },
    {
      id: 3,
      room: 'BT-3691-Omni',
      host: 'Jules Park',
      date: 'Feb 12, 2026 08:15 AM',
      participants: 24,
      status: 'Draft',
      statusColor: 'info',
    },
    {
      id: 4,
      room: 'BT-5520-Atlas',
      host: 'Maria Chen',
      date: 'Feb 15, 2026 06:45 PM',
      participants: 12,
      status: 'Scheduled',
      statusColor: 'success',
    },
  ]);

  const API_BASE_URL = 'http://localhost:4000/api';

  const scrollToCreateSession = () => {
    const form = document.getElementById('createSessionForm');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinRoomChange = (e) => {
    setJoinRoomId(e.target.value);
  };

  const handleJoinSessionSubmit = async (e) => {
    e.preventDefault();

    try {
      // This would typically call an API endpoint to join the session
      Swal.fire({
        title: 'Joining session',
        text: `Connecting to room ${joinRoomId}...`,
        icon: 'info',
        confirmButtonColor: '#234756',
      });
      setJoinRoomId('');
    } catch (error) {
      Swal.fire({
        title: 'Join failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#234756',
      });
    }
  };

  const handleCreateSessionChange = (e) => {
    const { name, value } = e.target;
    setCreateSessionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSessionSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: 'Login required',
        text: 'You must be logged in to create a session.',
        icon: 'warning',
        confirmButtonColor: '#234756',
      });
      return;
    }

    if (!createSessionData.title) {
      return;
    }

    try {
      const token = localStorage.getItem('btls_token');
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createSessionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create session');
      }

      Swal.fire({
        title: 'Session created',
        text: `Room ID: ${data.session.room_id}`,
        icon: 'success',
        confirmButtonColor: '#234756',
      });
      setCreateSessionData({ title: '', scheduledAt: '' });
    } catch (error) {
      Swal.fire({
        title: 'Creation failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#234756',
      });
    }
  };

  return (
    <section id="sessions" className="section bg-surface">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
          <div>
            <h2 className="section-title mb-1">Upcoming Sessions</h2>
            <p className="text-muted mb-0">Manage scheduled calls and data connections.</p>
          </div>
          <button className="btn btn-primary" onClick={scrollToCreateSession}>
            Create Session
          </button>
        </div>
        <div className="row g-4 mb-4">
          <div className="col-lg-5">
            <div className="feature-card">
              <h5 className="mb-3">Join a Session</h5>
              <form onSubmit={handleJoinSessionSubmit}>
                <label className="form-label">Room ID</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="BT-XXXX-YYYY"
                  value={joinRoomId}
                  onChange={handleJoinRoomChange}
                  required
                />
                <button className="btn btn-outline-primary w-100 mt-3" type="submit">
                  Join Session
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="feature-card">
              <h5 className="mb-3">Create a Session (Logged in only)</h5>
              <form id="createSessionForm" onSubmit={handleCreateSessionSubmit}>
                <div className="mb-3">
                  <label className="form-label">Session Title</label>
                  <input
                    className="form-control"
                    type="text"
                    name="title"
                    value={createSessionData.title}
                    onChange={handleCreateSessionChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Scheduled Time</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    name="scheduledAt"
                    value={createSessionData.scheduledAt}
                    onChange={handleCreateSessionChange}
                  />
                </div>
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={!user}
                >
                  Create Session
                </button>
              </form>
              <small className="text-muted d-block mt-2">
                {user ? 'Create a new room and share the Room ID.' : 'Log in to create a session.'}
              </small>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Room</th>
                <th>Host</th>
                <th>Date</th>
                <th>Participants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.room}</td>
                  <td>{session.host}</td>
                  <td>{session.date}</td>
                  <td>{session.participants}</td>
                  <td>
                    <span
                      className={`badge bg-${session.statusColor}-subtle text-${session.statusColor}`}
                    >
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Sessions;
