import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

const MOBILE_LINKS = [
  ['/about', 'About Us', 'fa-circle-info'],
  ['/menu', 'Menu', 'fa-utensils'],
  ['/reviews', 'Reviews', 'fa-star'],
  ['/blog', 'Blog', 'fa-newspaper'],
  ['/contacts', 'Contacts', 'fa-envelope'],
];

// logged-in user (the login pages store it in localStorage)
const clearStaleAuthOnFreshSession = () => {
  const hasStarted = sessionStorage.getItem('gusto_session_started');
  if (hasStarted) return;

  sessionStorage.setItem('gusto_session_started', '1');
  ['token', 'auth_token', 'user', 'gustoUser'].forEach((key) => localStorage.removeItem(key));
};

const readUser = () => {
  try {
    clearStaleAuthOnFreshSession();
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const raw = localStorage.getItem('user');
    if (!token || !raw || raw === 'undefined') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(readUser);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // refresh the user after every navigation (login / logout / OAuth redirect)
  useEffect(() => {
    setAuthUser(readUser());
    setUserMenuOpen(false);
  }, [location.pathname]);

  // close the account menu on outside click or Escape
  useEffect(() => {
    if (!userMenuOpen) return undefined;
    const onClick = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setUserMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [userMenuOpen]);

  const handleLogout = () => {
    ['token', 'auth_token', 'user', 'gustoUser'].forEach((k) => localStorage.removeItem(k));
    setAuthUser(null);
    setUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const initial = (authUser?.name || authUser?.email || '?').charAt(0).toUpperCase();

  // close the drawer on route change, and stop the page scrolling behind it
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <header className="bites-navbar fixed-navbar">
      <div className="bites-container">
        <Link to="/" className="brand brand-link" aria-label="Go to homepage">
          <span className="brand-name">
            <span className="brand-word">GUS</span>
            <span className="brand-accent">TO</span>
          </span>
        </Link>

        {/* Mobile bar: cart + menu button */}
        <div className="mobile-bar">
          <Link to="/cart" className="cart-icon mobile-cart-icon" aria-label={`Cart, ${totalItems} items`} onClick={closeMobileMenu}>
            <i className="fa-solid fa-cart-shopping"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <button className={`mobile-menu-btn ${isMobileMenuOpen ? 'is-open' : ''}`} onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>

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
          <div className="mobile-nav-head">
            <Link to="/" className="brand brand-link" aria-label="Go to homepage" onClick={closeMobileMenu}>
              <span className="brand-name">
                <span className="brand-word">GUS</span>
                <span className="brand-accent">TO</span>
              </span>
            </Link>
          </div>

          <div className="mobile-nav-content">
            {MOBILE_LINKS.map(([to, label, icon]) => (
              <Link key={to} to={to} className={location.pathname === to ? 'active' : ''} onClick={closeMobileMenu}>
                <span className="mobile-link-icon"><i className={`fa-solid ${icon}`}></i></span>
                {label}
              </Link>
            ))}

            <div className="mobile-actions">
              {authUser && (
                <div className="mobile-user">
                  <span className="user-avatar" aria-hidden="true">{initial}</span>
                  <div className="mobile-user-info">
                    <strong>{authUser.name}</strong>
                    {authUser.email && <small>{authUser.email}</small>}
                  </div>
                </div>
              )}

              <Link to="/cart" className="mobile-cart" onClick={closeMobileMenu}>
                <span><i className="fa-solid fa-cart-shopping"></i> My cart</span>
                <b className="mobile-count">{totalItems}</b>
              </Link>
              <Link to="/reservation" className="mobile-reserve" onClick={closeMobileMenu}>
                <i className="fa-solid fa-utensils"></i> Reserve a table
              </Link>

              {authUser ? (
                <button type="button" className="mobile-logout" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              ) : (
                <Link to="/login" className="mobile-login" onClick={closeMobileMenu}>
                  <i className="fa-solid fa-right-to-bracket"></i> Sign in
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="actions desktop-menu">
          <Link to="/cart" className="cart-icon" onClick={closeMobileMenu}>
            <i className="fa-solid fa-cart-shopping"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <Link to="/reservation" className="reserve"><i className="fa-solid fa-utensils"></i></Link>

          {authUser ? (
            <div className="user-menu" ref={userMenuRef}>
              <button
                type="button"
                className="user-avatar"
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((o) => !o)}
              >
                {initial}
              </button>
              {userMenuOpen && (
                <div className="user-dropdown" role="menu">
                  <div className="user-dropdown-head">
                    <span className="user-avatar user-avatar--lg" aria-hidden="true">{initial}</span>
                    <div>
                      <strong>{authUser.name || 'My account'}</strong>
                      {authUser.email && <small>{authUser.email}</small>}
                    </div>
                  </div>
                  <Link to="/reservation" role="menuitem" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <i className="fa-solid fa-utensils"></i> Reserve a table
                  </Link>
                  <Link to="/cart" role="menuitem" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <i className="fa-solid fa-cart-shopping"></i> My cart
                  </Link>
                  <button type="button" role="menuitem" className="user-dropdown-item user-dropdown-logout" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login">Sign in</Link>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}
    </header>
  );
}