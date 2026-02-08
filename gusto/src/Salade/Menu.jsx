import React, { useState, useEffect } from 'react';
import './Menu.css';
import { useCart } from './Navbar';
import Footer from './Footer';

export default function Menu() {
  const { addToCart } = useCart();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const response = await fetch('http://localhost:8000/api/products');
      const data = await response.json();
      setDishes(data.map(product => ({
        title: product.name,
        desc: product.description,
        price: parseFloat(product.price).toFixed(2),
        img: `http://localhost:8000${product.image}`
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="menu-grid">
          {dishes.map(d => (
            <article key={d.title} className="menu-card">
              <div className="menu-card-image">
                <img src={d.img} alt={d.title} />
              </div>
              <div className="menu-card-content">
                <h3 className="menu-card-title">{d.title}</h3>
                <div className="menu-card-desc">{d.desc}</div>
                <div className="menu-card-footer">
                  <div className="menu-card-price">${d.price}</div>
                  <button className="menu-add-btn" onClick={() => addToCart(d)}><i className="bi bi-cart"></i></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
