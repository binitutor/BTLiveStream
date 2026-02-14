import React from 'react';

function Navigation({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#top">
          BT Live Stream
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#features">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#auth">
                Account
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#dashboard">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#sessions">
                Sessions
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#support">
                Support
              </a>
            </li>
          </ul>
          <div className="d-flex ms-lg-3 gap-2">
            <span className="navbar-text fw-semibold" id="userStatus">
              {user ? `Hi, ${user.name}` : 'Guest'}
            </span>
            <button className="btn btn-outline-primary">Notify Me</button>
            <button className="btn btn-primary">Start Call</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
