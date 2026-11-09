import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './Navbar';
import { AuthProvider } from './AuthContext';
import Navbar from './Navbar';
import Hero from './Hero';
import Menu from './Menu';
import Reviews from './Reviews';
import Blog from './Blog';
import Contacts from './Contacts';
import Reservation from './Reservation';
import Cart from './Cart';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import EmailVerification from './EmailVerification';

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
          <Route path="/dashboard/*" element={<Suspense fallback={null}><DashboardApp /></Suspense>} />
        </Routes>
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

