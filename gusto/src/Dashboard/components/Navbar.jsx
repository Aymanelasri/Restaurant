import React, { useState, useEffect, useCallback } from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

// The theme is dark-only now, so toggleDarkMode / darkMode props are accepted but unused.
function Navbar({ setSidebarOpen }) {
  const getStoredToken = useCallback(() => localStorage.getItem('auth_token') || localStorage.getItem('token') || '', []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const userName = user.name || 'Admin User';
  const userInitial = userName.charAt(0).toUpperCase();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const response = await fetch('https://restaurant-bvjt.onrender.com/api/notifications', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 419) {
          localStorage.removeItem('token');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('gustoUser');
          window.location.href = '/login';
          return;
        }
        return;
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, [getStoredToken]);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.name !== user.name) {
        setUser(storedUser);
      }
    };
    checkUser();

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    // Close dropdowns when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown')) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [fetchNotifications, user.name]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
     window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom">
      <div className="container-fluid">
        <button
          className="btn btn-link text-muted d-lg-none p-0 me-3"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon style={{width: '24px', height: '24px'}} />
        </button>

        <div className="d-flex align-items-center flex-fill">
          <div className="d-none d-md-block">
            <span className="eyebrow">Dashboard</span>
            <h6 className="mb-0 mt-1" style={{ fontSize: '1.15rem' }}>Welcome back, {userName}</h6>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <div className="dropdown me-3 position-relative">
            <button
              className="btn btn-link p-2 position-relative text-muted"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              <BellIcon style={{width: '22px', height: '22px'}} />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{fontSize: '0.6rem', background: 'var(--red)'}}>
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{minWidth: '300px', maxHeight: '400px', overflowY: 'auto', right: 0, top: '100%'}}>
                <h6 className="dropdown-header" style={{ fontFamily: 'Inter', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--red)' }}>Notifications</h6>
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div key={index} className="dropdown-item" style={{whiteSpace: 'normal'}}>
                      <small className="d-block" style={{ color: 'var(--gold)' }}>{notif.type}</small>
                      <div>{notif.message}</div>
                      <small className="text-muted">{notif.time}</small>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item text-center text-muted">No new notifications</div>
                )}
              </div>
            )}
          </div>

          <div className="dropdown position-relative">
            <div
              className="d-flex align-items-center"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              style={{cursor: 'pointer'}}
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold me-2" style={{width: '38px', height: '38px', fontSize: '14px', background: 'linear-gradient(135deg, var(--red), var(--red-dark))', boxShadow: '0 4px 16px rgba(255,42,26,0.4)'}}>
                {userInitial}
              </div>
              <div className="d-none d-sm-block text-start">
                <div className="fw-semibold" style={{ lineHeight: 1.2 }}>{userName}</div>
                <small className="text-muted">Administrator</small>
              </div>
            </div>
            {showProfileMenu && (
              <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{right: 0, top: '100%', minWidth: '200px'}}>
                <a className="dropdown-item" href="#profile" onClick={(e) => e.preventDefault()}>Profile Settings</a>
                <a className="dropdown-item" href="#activity" onClick={(e) => e.preventDefault()}>Activity Log</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" style={{ color: '#ff6b5e' }} href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;