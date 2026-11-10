import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://restaurant-bvjt.onrender.com/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link sent to your email!');
        setEmail('');
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <div className="auth-image-content">
            <h2>Forgot Password?</h2>
            <p>No worries! Enter your email and we'll send you a reset link</p>
          </div>
        </div>
        
        <div className="auth-form">
          <h2>Reset Your Password</h2>
          <p>Enter your email address to receive a password reset link</p>

          {message && <div className="success-message"><p><i className="fa-solid fa-circle-check"></i> {message}</p></div>}
          {error && <div className="error-message"><p><i className="fa-solid fa-circle-exclamation"></i> {error}</p></div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="auth-links">
            <p>Remember your password? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}