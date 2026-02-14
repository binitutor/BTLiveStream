import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Sessions from './components/Sessions';
import Support from './components/Support';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem('btls_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('btls_token', userData.token);
    localStorage.setItem('btls_user', JSON.stringify(userData.user));
    setUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('btls_token');
    localStorage.removeItem('btls_user');
    setUser(null);
  };

  return (
    <div className="app">
      <Navigation user={user} onLogout={handleLogout} />
      <Hero />
      <Features />
      <Dashboard />
      <Auth user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <Sessions user={user} />
      <Support />
      <Footer />
    </div>
  );
}

export default App;
