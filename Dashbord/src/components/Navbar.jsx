import { useState, useEffect } from "react";
import { FiMoon, FiSun, FiLogOut, FiMenu } from "react-icons/fi";

export default function Navbar({ sidebarOpen, setSidebarOpen, isMobile }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:3000';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          {/* Menu button for mobile */}
          {isMobile && (
            <button 
              className="btn btn-outline-secondary me-3" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </button>
          )}
          <h1 className="navbar-brand mb-0 fs-5 fw-bold">Admin Dashboard</h1>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm" 
            onClick={() => setDark(!dark)}
            style={{border:'none',background:'transparent'}}
          >
            {dark ? <FiSun style={{color:'#ffc107'}} /> : <FiMoon />}
          </button>
          <button 
            className="btn btn-danger btn-sm" 
            onClick={logout}
          >
            <FiLogOut className="d-none d-md-inline" /> 
            <span className="d-none d-md-inline ms-1">Déconnexion</span>
            <FiLogOut className="d-md-none" />
          </button>
        </div>
      </div>
    </nav>
  );
}
