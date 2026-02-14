import React from 'react';

function Features() {
  return (
    <section id="features" className="section bg-surface">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4">
            <div className="feature-card">
              <h5>Peer-to-peer Routing</h5>
              <p>
                Auto-select the fastest path between participants with adaptive bitrate
                streaming.
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="feature-card">
              <h5>Live Health Checks</h5>
              <p>
                Track jitter, packet loss, and audio levels in real time from a single
                dashboard.
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="feature-card">
              <h5>Session Controls</h5>
              <p>
                Lock rooms, invite participants, and moderate with role-based controls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
