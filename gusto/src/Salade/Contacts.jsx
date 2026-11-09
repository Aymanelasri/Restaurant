import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Footer from './Footer';
import './Contacts.css';

export default function Contacts() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const flash = (text, type = 'err') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEmailUs = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      flash('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      await emailjs.send(
        'service_9fjozmc',
        'template_w1b380a',
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        'BLviy0RIzCBBpwgYX'
      );
      flash('Email sent successfully!', 'ok');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email error:', error);
      flash('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="ct-page">
        <div className="ct-wrap">
          <header className="ct-head">
            <h2>Contact &amp; Reservations</h2>
            <p>Get in touch with us for reservations and inquiries</p>
          </header>

          <div className="ct-grid">
            <div className="ct-card">
              <h3>Contact Information</h3>
              <div className="ct-row">
                <strong><i className="fa-solid fa-location-dot"></i> Address</strong>
                <p>123 Gusto Restaurant, Casablanca</p>
              </div>
              <div className="ct-row">
                <strong><i className="fa-solid fa-phone"></i> Phone</strong>
                <p>+212 6 11 22 33 44</p>
              </div>
              <div className="ct-row">
                <strong><i className="fa-solid fa-envelope"></i> Email</strong>
                <p>Aymane@gusto.com</p>
              </div>
              <h4>Opening Hours</h4>
              <ul className="ct-hours">
                <li><i className="fa-regular fa-clock"></i> Monday-Friday: 11:30 AM — 10:00 PM</li>
                <li><i className="fa-regular fa-clock"></i> Saturday-Sunday: 9:00 AM — 11:00 PM</li>
              </ul>
            </div>

            <div className="ct-card">
              <h3>Book a Table</h3>
              <p>Ready to experience our delicious cuisine? Call us or send an email and we'll reserve the perfect spot for you.</p>

              <form className="ct-form" onSubmit={handleEmailUs}>
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} />
                <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} />
                <textarea name="message" placeholder="Message ..." rows="5" value={formData.message} onChange={handleInputChange} />
                <button type="submit" className="ct-submit" disabled={isLoading}>
                  {isLoading ? 'Sending...' : (<><i className="fa-solid fa-envelope"></i> Email Us</>)}
                </button>
              </form>

              {message && (
                <div className={`ct-msg ${message.type}`}>{message.text}</div>
              )}

              <div className="ct-tip">
                <h5><i className="fa-solid fa-lightbulb"></i> Quick Tip</h5>
                <p>For large groups (8+ people), please call us directly to ensure the best seating arrangement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}