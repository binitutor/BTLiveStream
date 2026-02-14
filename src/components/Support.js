import React from 'react';
import Swal from 'sweetalert2';

function Support() {
  const handleNotifyClick = () => {
    Swal.fire({
      title: 'Updates Enabled',
      text: 'We\'ll notify you before your next BT Live Stream session.',
      icon: 'success',
      confirmButtonColor: '#234756',
    });
  };

  const handleOpenTicket = () => {
    Swal.fire({
      title: 'Support Ticket',
      text: 'Opening a support ticket. Our team will respond within 6 minutes.',
      icon: 'info',
      confirmButtonColor: '#234756',
    });
  };

  const handleBrowseDocs = () => {
    Swal.fire({
      title: 'Knowledge Base',
      text: 'Redirecting to our documentation...',
      icon: 'info',
      confirmButtonColor: '#234756',
    });
  };

  const handleContactSupport = () => {
    Swal.fire({
      title: 'Contact Support',
      text: 'Our support team is available 24/7. We\'ll be in touch shortly.',
      icon: 'info',
      confirmButtonColor: '#234756',
    });
  };

  return (
    <section id="support" className="section">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6">
            <h2 className="section-title">Support Center</h2>
            <p className="text-muted">
              Keep your team connected with 24/7 operator support, call insights, and
              onboarding guides.
            </p>
            <div className="support-card">
              <div>
                <h5 className="mb-1">Priority Assistance</h5>
                <p className="text-muted mb-0">Average response time: 6 minutes.</p>
              </div>
              <button className="btn btn-outline-primary" onClick={handleOpenTicket}>
                Open Ticket
              </button>
            </div>
            <div className="support-card">
              <div>
                <h5 className="mb-1">Knowledge Base</h5>
                <p className="text-muted mb-0">Guides for device setup and call optimization.</p>
              </div>
              <button className="btn btn-outline-primary" onClick={handleBrowseDocs}>
                Browse Docs
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="faq-card">
              <h5 className="mb-3">Quick Tips</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <strong className="text-primary">Invite securely:</strong>
                  Share unique room links with auto-expiring tokens.
                </li>
                <li className="mb-3">
                  <strong className="text-primary">Optimize audio:</strong>
                  Use echo cancellation and adaptive noise suppression.
                </li>
                <li>
                  <strong className="text-primary">Scale instantly:</strong>
                  Upgrade sessions with one-click SFU escalation.
                </li>
              </ul>
              <button className="btn btn-primary w-100" onClick={handleContactSupport}>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Support;
