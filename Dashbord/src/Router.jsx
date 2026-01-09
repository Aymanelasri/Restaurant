import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/RestaurantUsers";
import Orders from "./pages/Orders";
import Reservations from "./pages/Reservations";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import ReviewsManagement from "./components/ReviewsManagement";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // أخذ الـ token من الـ URL وحفظه
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // إزالة الـ token من الـ URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // مراقبة تغيير حجم الشاشة
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <BrowserRouter>
      <div className="d-flex">
        {/* Sidebar - مخفي على الموبايل إلا إذا كان مفتوح */}
        <div className={`${isMobile ? (sidebarOpen ? 'd-block' : 'd-none') : 'd-block'}`}>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        
        {/* Overlay للموبايل */}
        {isMobile && sidebarOpen && (
          <div 
            className="position-fixed w-100 h-100" 
            style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040, top: 0, left: 0}}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="flex-grow-1" style={{minHeight:'100vh',backgroundColor:'#f5f5f5'}}>
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reviews" element={<ReviewsManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
