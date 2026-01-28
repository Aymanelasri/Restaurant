import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiX, FiHome, FiShoppingBag, FiCalendar, FiUsers, FiBarChart2, FiSettings, FiMessageSquare } from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [open, setOpen] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  const isMobile = window.innerWidth < 768;
  const location = useLocation();

  useEffect(() => {
    // Get admin name from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setAdminName(userData.name || 'Admin');
      } catch (e) {
        setAdminName('Admin');
      }
    }
  }, []);

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Tableau de Bord', color: '#ff6b6b' },
    { path: '/orders', icon: FiShoppingBag, label: 'Commandes', color: '#4ecdc4' },
    { path: '/reservations', icon: FiCalendar, label: 'Réservations', color: '#45b7d1' },
    { path: '/users', icon: FiUsers, label: 'Utilisateurs', color: '#96ceb4' },
    { path: '/reviews', icon: FiMessageSquare, label: 'Commentaires', color: '#ff9f43' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytiques', color: '#feca57' },
    { path: '/settings', icon: FiSettings, label: 'Paramètres', color: '#ff9ff3' }
  ];

  return (
 <motion.div
  animate={{ width: isMobile ? 280 : (open ? 280 : 80) }}
  className="text-white p-0 d-flex flex-column"
  style={{
    minHeight: '110vh',
    background: 'linear-gradient(135deg, #0F172A 0%, #0A2540 50%,  #052E16 100%)',
    overflowY: 'auto',
    position: isMobile ? 'fixed' : 'relative',
    zIndex: isMobile ? 1050 : 'auto',
    top: 0,
    left: 0,
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
  }}
>

      {/* Header */}
      <div className="p-4 border-bottom border-light border-opacity-25">
        {isMobile && (
          <div className="d-flex justify-content-end mb-3">
            <button 
              className="btn btn-outline-light btn-sm" 
              onClick={() => setSidebarOpen(false)}
              style={{ borderRadius: '50%', width: '40px', height: '40px' }}
            >
              <FiX size={18} />
            </button>
          </div>
        )}
        
        <div className="d-flex align-items-center">
        
          {(open || isMobile) && (
            <div>
              <h5 className="mb-0 fw-bold">{adminName}</h5>
              <small className="opacity-75">Restaurant Dashboard</small>
            </div>
          )}
        </div>
        
        {!isMobile && (
          <button 
            className="btn btn-outline-light btn-sm mt-3 w-100" 
            onClick={() => setOpen(!open)}
            style={{ 
              borderRadius: '25px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {open ? 'X' : '☰'}
          </button>
        )}
      </div>
      
      {/* Menu Items */}
      <div className="p-3">
        <ul className="list-unstyled">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={index} className="mb-2">
                <Link 
                  to={item.path} 
                  className="d-flex align-items-center text-decoration-none text-white rounded-3 position-relative overflow-hidden"
                  style={{
                    padding: open || isMobile ? '12px' : '12px',
                    justifyContent: open || isMobile ? 'flex-start' : 'center',
                    background: isActive 
                      ? 'rgba(255,255,255,0.25)' 
                      : 'transparent',
                    backdropFilter: isActive ? 'blur(10px)' : 'none',
                    border: isActive 
                      ? '1px solid rgba(255,255,255,0.4)' 
                      : '1px solid transparent',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'translateX(5px)' : 'translateX(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: open || isMobile ? '40px' : '35px',
                      height: open || isMobile ? '40px' : '35px',
                      background: item.color,
                      boxShadow: `0 4px 15px ${item.color}40`,
                      marginRight: open || isMobile ? '12px' : '0'
                    }}
                  >
                    <Icon size={open || isMobile ? 18 : 18} color="white" />
                  </div>
                  {(open || isMobile) && (
                    <span className="fw-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Footer */}
      {(open || isMobile) && (
        <div className="mt-2 p-4 border-top border-light border-opacity-25">
          <div 
            className="p-3 rounded-3 text-center"
            style={{
              background: 'rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <small className="opacity-75">Version 1.0.0</small><br/>
            <small className="opacity-50">© 2026 Gusto Restaurant</small>
          </div>
        </div>
      )}
    </motion.div>
  );
}
