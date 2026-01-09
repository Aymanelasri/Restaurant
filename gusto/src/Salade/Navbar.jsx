import React, { createContext, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// إنشاء Context للسلة
const CartContext = createContext();

// مزود السلة
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.title === item.title || cartItem.title === item.name);
      if (existingItem) {
        return prev.map(cartItem => 
          (cartItem.title === item.title || cartItem.title === item.name)
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { 
        title: item.title || item.name, 
        price: typeof item.price === 'string' ? item.price.replace('$', '') : item.price, 
        img: item.img || item.image, 
        desc: item.desc || `Delicious ${item.category?.toLowerCase() || ''} cuisine`,
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (title) => {
    setCartItems(prev => prev.filter(item => item.title !== title));
  };

  const decreaseQuantity = (title) => {
    setCartItems(prev => 
      prev.map(item => 
        item.title === title && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default function Navbar() {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bites-navbar fixed-navbar">
      <div className="bites-container">
        <div className="brand">
          <span className="brand-name" style={{fontWeight: '600px', fontSize: '2rem', letterSpacing: '1px'}}>
            <span style={{color: '#b11217'}}>GU</span>
            <span style={{color: '#f4b400'}}>STO</span>
          </span>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <i class="fa-solid fa-bars"></i>
          
        </button>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-menu" aria-label="Primary">
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
          <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>Menu</Link>
          <Link to="/reviews" className={location.pathname === '/reviews' ? 'active' : ''}>Reviews</Link>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</Link>
          <Link to="/contacts" className={location.pathname === '/contacts' ? 'active' : ''}>Contacts</Link>
        </nav>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} aria-label="Mobile menu">
          <div className="mobile-nav-content">
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMobileMenu}>About Us</Link>
            <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''} onClick={closeMobileMenu}>Menu</Link>
            <Link to="/reviews" className={location.pathname === '/reviews' ? 'active' : ''} onClick={closeMobileMenu}>Reviews</Link>
            <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''} onClick={closeMobileMenu}>Blog</Link>
            <Link to="/contacts" className={location.pathname === '/contacts' ? 'active' : ''} onClick={closeMobileMenu}>Contacts</Link>
            <div className="mobile-actions">
              <Link to="/cart" className="mobile-cart" onClick={closeMobileMenu}>
                <i className="bi bi-cart"></i> Cart ({totalItems})
              </Link>
              <Link to="/reservation" className="mobile-reserve" onClick={closeMobileMenu}>
                <i className="fa-solid fa-utensils"></i> Reserve Table
              </Link>
            </div>
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="actions desktop-menu">
          <Link to="/cart" className="cart-icon">
            <i className="bi bi-cart"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <Link to="/reservation" className="reserve"><i className="fa-solid fa-utensils"></i></Link>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}
    </header>
  );
}
