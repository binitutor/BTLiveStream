import React, { useState } from 'react';
import Swal from 'sweetalert2';

function Auth({ user, onLogin, onLogout }) {
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const API_BASE_URL = 'http://localhost:5001/api';

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign up');
      }

      onLogin(data);
      setSignupData({ name: '', email: '', password: '' });
      Swal.fire({
        title: 'Account created',
        text: 'Welcome to BT Live Stream!',
        icon: 'success',
        confirmButtonColor: '#234756',
      });
    } catch (error) {
      Swal.fire({
        title: 'Sign up failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#234756',
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to log in');
      }

      onLogin(data);
      setLoginData({ email: '', password: '' });
      Swal.fire({
        title: 'Welcome back',
        text: `Logged in as ${data.user.name}`,
        icon: 'success',
        confirmButtonColor: '#234756',
      });
    } catch (error) {
      Swal.fire({
        title: 'Login failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#234756',
      });
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    Swal.fire({
      title: 'Logged out',
      text: 'You have been successfully logged out.',
      icon: 'success',
      confirmButtonColor: '#234756',
    });
  };

  return (
    <section id="auth" className="section bg-surface">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="feature-card">
              <h4 className="mb-3">Create an Account</h4>
              <form onSubmit={handleSignupSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="feature-card">
              <h4 className="mb-3">Log In</h4>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <button className="btn btn-outline-primary w-100" type="submit">
                  Log In
                </button>
              </form>
              {user && (
                <button
                  className="btn btn-link text-secondary mt-3"
                  type="button"
                  onClick={handleLogoutClick}
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;
