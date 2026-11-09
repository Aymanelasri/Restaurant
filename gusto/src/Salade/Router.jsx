import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './Navbar';
import { AuthProvider } from './AuthContext';
import Navbar from './Navbar';

// Lazy load components
const Hero = lazy(() => import('./Hero'));
const Menu = lazy(() => import('./Menu'));
const Reviews = lazy(() => import('./Reviews'));
const Blog = lazy(() => import('./Blog'));
const Contacts = lazy(() => import('./Contacts'));
const Reservation = lazy(() => import('./Reservation'));
const Cart = lazy(() => import('./Cart'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const ResetPassword = lazy(() => import('./ResetPassword'));
const EmailVerification = lazy(() => import('./EmailVerification'));

// Loading component
const Loading = () => (
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const DashboardApp = lazy(() => import('../Dashboard/DashboardApp'));

function AuthHandler() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (!token || !userParam) {
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem('token', token);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      const targetPath = user.role === 'admin' ? '/dashboard' : '/reservation';

      if (location.pathname !== targetPath) {
        window.location.href = targetPath;
        return;
      }

      window.history.replaceState({}, document.title, targetPath);
    } catch (error) {
      localStorage.setItem('token', token);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', userParam);

      if (location.pathname !== '/reservation') {
        window.location.href = '/reservation';
      }
    }
  }, [location]);

  return null;
}

function AppRoutes() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider>
        <AuthHandler />
        {!isAdminRoute && <Navbar />}
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<Hero />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard/*" element={<DashboardApp />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

