import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand-section">
          <div className="brand">
            <span className="brand-icon"><i className="fa-solid fa-utensils"></i></span>
            <span className="brand-name">Gusto</span>
          </div>
          <p className="footer-desc">Experience the finest dining with authentic flavors, warm hospitality, and memorable evenings.</p>

          <div className="newsletter">
            <h4>Subscribe to Our Newsletter</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </div>
          </div>

          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon facebook" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" className="social-icon instagram" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" className="social-icon youtube" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://twitter.com" className="social-icon twitter" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4><span className="gold-separator">✦</span> Quick Links</h4>
          <ul>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/reviews">Reviews</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contacts">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4><span className="gold-separator">✦</span> Our Services</h4>
          <ul>
            <li><a href="/menu">Online Order</a></li>
            <li><a href="/reservation">Table Reservation</a></li>
            <li><a href="/menu">Catering</a></li>
            <li><a href="/menu">Private Events</a></li>
            <li><a href="/menu">Delivery</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4><span className="gold-separator">✦</span> Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Restaurant St, Casablanca</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+212-625896321</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>Aymane@gusto.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <span>Mon-Sun: 10AM - 11PM</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Gusto Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;