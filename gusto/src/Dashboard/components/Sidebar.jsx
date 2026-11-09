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
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Products', href: '/dashboard/products', icon: CubeIcon },
  { name: 'Chefs', href: '/dashboard/chefs', icon: UserGroupIcon },
  { name: 'Reservations', href: '/dashboard/reservations', icon: CalendarDaysIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBagIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ zIndex: 1040, background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'show' : ''} d-flex flex-column`}>
        <div className="d-flex align-items-center justify-content-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="h5 mb-0 mt-1">Restaurant</h1>
          </div>
          <button
            className="btn btn-link text-muted d-lg-none p-0"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon style={{width: '24px', height: '24px'}} />
          </button>
        </div>

        <div className="p-3 pb-0">
          <div className="rounded-4 p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle me-2" style={{width: '8px', height: '8px', background: 'var(--success)', boxShadow: '0 0 10px var(--success)'}}></div>
              <small className="text-muted text-uppercase" style={{ letterSpacing: '0.12em', fontSize: '0.68rem' }}>System online</small>
            </div>
          </div>
        </div>

        <nav className="flex-fill p-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link-item d-flex align-items-center px-3 py-3 mb-2 text-decoration-none rounded-4 ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="me-3" style={{width: '20px', height: '20px'}} />
                <span className="fw-medium">{item.name}</span>
                {isActive && (
                  <div className="ms-auto rounded-circle" style={{width: '6px', height: '6px', background: '#fff'}}></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="rounded-4 p-3 text-center" style={{ background: 'rgba(255,42,26,0.08)', border: '1px solid rgba(255,42,26,0.3)' }}>
            <small className="fw-semibold d-block" style={{ color: 'var(--red)' }}>Need help?</small>
            <small className="text-muted">Contact support</small>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;