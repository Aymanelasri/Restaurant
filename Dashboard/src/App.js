import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const tokenParam = urlParams.get('token');
    
    if (userParam && tokenParam) {
      try {
        localStorage.clear();
        sessionStorage.clear();
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', tokenParam);
        localStorage.setItem('token', tokenParam);
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
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
    <Router>
      <Routes>
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="d-flex">
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} />
              <div className="flex-fill d-flex flex-column">
                <Navbar 
                  toggleDarkMode={toggleDarkMode} 
                  darkMode={darkMode} 
                  setSidebarOpen={setSidebarOpen}
                />
                <main className={`flex-fill overflow-auto p-4 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/chefs" element={<Chefs />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;