import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand & Newsletter */}
        <div className="footer-section">
          <div className="brand">
            <span className="brand-icon">🍴</span>
            <span className="brand-name">Gusto</span>
          </div>
          <p className="footer-desc">Experience the finest dining with authentic flavors and exceptional service.</p>
          
          <div className="newsletter">
            <h4>Subscribe to Our Newsletter</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
          
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" className="social-icon instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" className="social-icon youtube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://twitter.com" className="social-icon twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/">About Us</a></li>
            <li><a href="/Reviews">Reviews</a></li>
            <li><a href="/Blog">Blog</a></li>
            <li><a href="/Contacts">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Our Services</h4>
          <ul>
            <li><a href="/menu">Online Order</a></li>
            <li><a href="/reservation">Table Reservation</a></li>
            <li><a href="/catering">Catering</a></li>
            <li><a href="/events">Private Events</a></li>
            <li><a href="/delivery">Delivery</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Restaurant St, Casablanca </span>
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