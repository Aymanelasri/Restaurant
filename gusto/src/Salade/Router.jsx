import React, { useEffect } from 'react';
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

function AuthHandler() {
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const user = params.get('user');
    
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', user);
      window.location.href = '/reservation';
    }
  }, [location]);
  
  return null;
}

export default function Router() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AuthHandler />
          <Navbar />
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
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

