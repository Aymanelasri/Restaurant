import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  ChartBarIcon, 
  CogIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  CubeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, color: 'text-primary' },
  { name: 'Users', href: '/users', icon: UsersIcon, color: 'text-success' },
  { name: 'Products', href: '/products', icon: CubeIcon, color: 'text-warning' },
  { name: 'Chefs', href: '/chefs', icon: UserGroupIcon, color: 'text-info' },
  { name: 'Reservations', href: '/reservations', icon: CalendarDaysIcon, color: 'text-secondary' },
  { name: 'Orders', href: '/orders', icon: ShoppingBagIcon, color: 'text-danger' },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, color: 'text-dark' },
  { name: 'Settings', href: '/settings', icon: CogIcon, color: 'text-muted' },
];

function Sidebar({ sidebarOpen, setSidebarOpen, darkMode }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" style={{zIndex: 1040}} onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar shadow-lg ${sidebarOpen ? 'show' : ''} d-flex flex-column ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
              <span className="text-white fw-bold">A</span>
            </div>
            <h1 className={`h5 fw-bold mb-0 ${darkMode ? 'text-light' : 'text-primary'}`}>Restaurant Admin</h1>
          </div>
          <button
            className="btn btn-link text-muted d-lg-none p-0"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon style={{width: '24px', height: '24px'}} />
          </button>
        </div>
        
        <div className="p-3">
          <div className={`${darkMode ? 'bg-secondary' : 'bg-light'} rounded-3 p-3 mb-3`}>
            <div className="d-flex align-items-center">
              <div className="bg-success rounded-circle me-2" style={{width: '8px', height: '8px'}}></div>
              <small className="text-muted">System Status: Online</small>
            </div>
          </div>
        </div>
        
        <nav className="flex-fill px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`d-flex align-items-center px-3 py-3 mb-2 text-decoration-none rounded-3 transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : darkMode ? 'text-light hover-bg-dark' : 'text-dark hover-bg-light'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`me-3 ${isActive ? 'text-white' : item.color}`} style={{width: '20px', height: '20px'}} />
                <span className="fw-medium">{item.name}</span>
                {isActive && (
                  <div className="ms-auto">
                    <div className="bg-white bg-opacity-25 rounded-circle" style={{width: '6px', height: '6px'}}></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-top">
          <div className="bg-gradient bg-primary rounded-3 p-3 text-white text-center">
            <small className="fw-medium">Need Help?</small>
            <div className="mt-1">
              <small>Contact Support</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;