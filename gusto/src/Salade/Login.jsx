import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Check if user is admin and redirect accordingly
        if (data.user.role === 'admin') {
          window.location.href = 'http://localhost:3005/dashboard';
        } else {
          navigate('/reservation');
        }
      } else {
        setError(data.message || 'Login faileed');
      }
    } catch (error) {
      setError('Password or email is incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <div className="auth-image-content">
            <h2>Welcome Back!</h2>
            <p>Sign in to make your reservation and enjoy our delicious meals</p>
          </div>
        </div>
        
        <div className="auth-form">
          <h2>Login to Your Account</h2>
          <p>Please sign in to make a reservation</p>

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-links">
            <p>Don't have an account ? <Link to="/register">Sign up here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
  
}