import React from 'react';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="card accent-top" style={{width: '100%', maxWidth: '420px'}}>
        <div className="card-body p-5">
          <div className="mb-4">
            <span className="eyebrow">Admin</span>
            <h2 className="mt-2 mb-1" style={{fontSize: '2.2rem'}}>Dashboard Login</h2>
            <p className="text-muted mb-0">Sign in to manage your restaurant</p>
          </div>
          <button 
            onClick={handleGoogleLogin}
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#fff" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#fff" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#fff" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#fff" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}