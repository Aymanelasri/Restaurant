import React, { useState } from 'react';
import ApiService from '../services/apiService';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(email, password);
      onLogin(response.user);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="card accent-top" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body p-5">
          <div className="mb-4">
            <span className="eyebrow">Admin</span>
            <h2 className="mt-2 mb-1" style={{ fontSize: '2.2rem' }}>Welcome back</h2>
            <p className="text-muted mb-0">Sign in to your dashboard</p>
          </div>

          {error && (
            <div className="alert mb-3" role="alert" style={{ background: 'rgba(255,42,26,0.1)', border: '1px solid rgba(255,42,26,0.4)', color: '#ff8a80', borderRadius: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-3 text-uppercase"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <small className="text-muted">
              Demo credentials: admin@restaurant.com / password
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;