import React, { useState, useEffect } from 'react';
import './Menu.css';
import { useCart } from './Navbar';
import Footer from './Footer';

const defaultCategories = ['All', 'Mexican', 'Italian', 'Japanese', 'Drinks'];

export default function Menu() {
  const { addToCart } = useCart();
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    // Check for token from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://restaurant-bvjt.onrender.com/api/products');
      const data = await response.json();
      setDishes(data.map(product => ({
        title: product.name,
        category: product.category || 'General',
        desc: product.description,
        price: parseFloat(product.price).toFixed(2),
        img: `https://restaurant-bvjt.onrender.com${product.image}`
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set([...defaultCategories, ...dishes.map(d => d.category)])].filter(Boolean);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredDishes = dishes.filter(d => {
    const matchesCategory = selectedCategory === 'All' ? true : d.category === selectedCategory;
    const matchesSearch = !normalizedSearch || `${d.title} ${d.desc}`.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItem(item.title);
    window.clearTimeout(handleAddToCart.timeoutId);
    handleAddToCart.timeoutId = window.setTimeout(() => setAddedItem(null), 1000);
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return ( <>
    <div>
      <section className="menu-section">
        <h2 className="menu-title">Our Menu</h2>
        <p className="menu-subtitle">Seasonal, locally-sourced dishes crafted for sharing with love and passion</p>

        <div className={`cart-feedback ${addedItem ? 'show' : ''}`} aria-live="polite">
          {addedItem ? `${addedItem} added to cart` : 'Cart ready'}
        </div>

        <div className="menu-search-wrap">
          <label className="menu-search" htmlFor="menu-search-input">
            <span className="menu-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              id="menu-search-input"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search delicious dishes..."
              aria-label="Search menu items"
            />
          </label>
        </div>

        <div className="menu-category-tabs" aria-label="Menu categories">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={`menu-category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="menu-empty-state">
            <p>No dishes found matching your search</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredDishes.map(d => (
              <article key={d.title} className="menu-card">
                <div className="menu-card-image">
                  <img src={d.img} alt={d.title} />
                </div>
                <div className="menu-card-content">
                  <h3 className="menu-card-title">{d.title}</h3>
                  <div className="menu-card-category">{d.category}</div>
                  <div className="menu-card-desc">{d.desc}</div>
                  <div className="menu-card-footer">
                    <div className="menu-card-price">${d.price}</div>
                    <button
                      className={`menu-add-btn ${addedItem === d.title ? 'added' : ''}`}
                      onClick={() => handleAddToCart(d)}
                      aria-label={`Add ${d.title} to cart`}
                    >
                      <i className={`bi ${addedItem === d.title ? 'bi-check-lg' : 'bi-cart'}`}></i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
    <Footer />
    </>
  );
}
