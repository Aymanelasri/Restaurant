import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, MoonIcon, SunIcon, BellIcon } from '@heroicons/react/24/outline';

function Navbar({ toggleDarkMode, darkMode, setSidebarOpen }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const userName = user.name || 'Admin User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Check localStorage for user updates
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
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    window.location.href = 'http://localhost:3000/login';
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light border-bottom shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
      <div className="container-fluid">
        <button
          className="btn btn-link text-muted d-lg-none p-0 me-3"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon style={{width: '24px', height: '24px'}} />
        </button>
        
        <div className="d-flex align-items-center flex-fill">
          <div className="d-none d-md-block">
            <h6 className={`mb-0 ${darkMode ? 'text-light' : 'text-muted'}`}>Welcome back, {userName}!</h6>
            <small className={darkMode ? 'text-light' : 'text-muted'}>Here's what's happening today</small>
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          <div className="dropdown me-3 position-relative">
            <button 
              className={`btn btn-link p-2 position-relative ${darkMode ? 'text-light' : 'text-muted'}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              <BellIcon style={{width: '20px', height: '20px'}} />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className={`dropdown-menu dropdown-menu-end show position-absolute ${darkMode ? 'bg-dark text-light' : ''}`} style={{minWidth: '300px', maxHeight: '400px', overflowY: 'auto', right: 0, top: '100%'}}>
                <h6 className="dropdown-header">Notifications</h6>
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div key={index} className="dropdown-item" style={{whiteSpace: 'normal'}}>
                      <small className="text-muted d-block">{notif.type}</small>
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
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDarkMode();
            }}
            className={`btn btn-link p-2 me-3 ${darkMode ? 'text-light' : 'text-muted'}`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <SunIcon style={{width: '20px', height: '20px'}} /> : <MoonIcon style={{width: '20px', height: '20px'}} />}
          </button>
          
          <div className="dropdown position-relative">
            <div 
              className="d-flex align-items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              style={{cursor: 'pointer'}}
            >
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-medium me-2" style={{width: '36px', height: '36px', fontSize: '14px'}}>
                {userInitial}
              </div>
              <div className="d-none d-sm-block text-start">
                <div className={`fw-medium ${darkMode ? 'text-light' : 'text-dark'}`}>{userName}</div>
                <small className={darkMode ? 'text-light' : 'text-muted'}>Administrator</small>
              </div>
            </div>
            {showProfileMenu && (
              <div className={`dropdown-menu dropdown-menu-end show position-absolute ${darkMode ? 'bg-dark text-light' : ''}`} style={{right: 0, top: '100%', minWidth: '200px'}}>
                <a className={`dropdown-item ${darkMode ? 'text-light' : ''}`} href="#profile" onClick={(e) => e.preventDefault()}>Profile Settings</a>
                <a className={`dropdown-item ${darkMode ? 'text-light' : ''}`} href="#activity" onClick={(e) => e.preventDefault()}>Activity Log</a>
                <div className="dropdown-divider"></div>
                <a className={`dropdown-item ${darkMode ? 'text-light' : ''}`} href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;