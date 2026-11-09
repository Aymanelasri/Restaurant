import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
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

      if (response.ok && data.requires_verification) {
        setVerificationStep(true);
        setError('');
      } else if (response.ok) {
        console.log('Login response:', data);
        console.log('User role:', data.user.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth_token', data.token);
        
        console.log('Stored user:', localStorage.getItem('user'));
        
        // Check if user is admin
        if (data.user && data.user.role === 'admin') {
          console.log('Redirecting to Dashboard...');
          const userData = encodeURIComponent(JSON.stringify(data.user));
          const redirectUrl = `/dashboard?user=${userData}&token=${data.token}`;
          console.log('Redirect URL:', redirectUrl);
          window.location.href = redirectUrl;
        } else {
          console.log('Redirecting to reservation...');
          navigate('/reservation');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Password or email is incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/reservation');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      setError('Verification failed');
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
              <p><i className="fa-solid fa-circle-exclamation"></i> {error}</p>
            </div>
          )}

          {verificationStep ? (
            <>
              <p className="verification-message"><i className="fa-solid fa-envelope"></i> Check your email for verification code</p>
              <form onSubmit={handleVerification}>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                </div>
                <button 
                  type="submit" 
                  className="auth-btn"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>
            </>
          ) : (
            <>
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

            <div className="auth-forgot">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button 
            className="google-btn"
            onClick={() => window.location.href = 'http://localhost:8000/auth/google'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Continue with Google
          </button>
            </>
          )}

          <div className="auth-links">
            <p>Don't have an account ? <Link to="/register">Sign up here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
  
}