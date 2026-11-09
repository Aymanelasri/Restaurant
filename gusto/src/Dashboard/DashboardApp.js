import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Reservations from './pages/Reservations';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Chefs from './pages/Chefs';
import ProtectedRoute from './components/ProtectedRoute';

import './dashboard-base.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/dashboard.css';
import './styles/Theme.css';

// Google login redirects back here with ?user=...&token=...
// This must run BEFORE ProtectedRoute checks localStorage.
function consumeAuthParams() {
  const params = new URLSearchParams(window.location.search);
  const userParam = params.get('user');
  const tokenParam = params.get('token');
  if (!userParam || !tokenParam) return;
  try {
    const userData = JSON.parse(decodeURIComponent(userParam));
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_token', tokenParam);
    localStorage.setItem('token', tokenParam);
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (error) {
    console.error('Failed to parse user data:', error);
  }
}

function DashboardApp() {
  consumeAuthParams();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <ProtectedRoute>
      <div className="app-shell d-flex w-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} />
        <div className="app-content flex-fill d-flex flex-column">
          <Navbar
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            setSidebarOpen={setSidebarOpen}
          />
          <main className={`app-main flex-fill overflow-visible p-3 p-md-4 p-xl-5 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="products" element={<Products />} />
              <Route path="chefs" element={<Chefs />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="orders" element={<Orders />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardApp;