import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function Router() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

