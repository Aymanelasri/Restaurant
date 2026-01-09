import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MakeReservation.css';

export default function MakeReservation() {
  const navigate = useNavigate();

  const handleReservationClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (token) {
      navigate('/reservation');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="mr-hero reveal">
      <div className="mr-container">
        <div className="mr-content">
          <h1>Do You Have Any Dinner Plan Today? <span>Reserve Your Table</span></h1>
          <p>
            Make online reservations, read restaurant reviews from diners, and earn
            points towards free meals. OpenTable is a real-time online reservation.
          </p>
          <div className="mr-actions">
            <button onClick={handleReservationClick} className="mr-cta">Make Reservation</button>
          </div>
        </div>

        <div className="mr-visual">
          <div className="mr-image-ring">
            <img src="/restaurants/crouvette.webp" alt="dish" />
          </div>
        </div>
      </div>
    </section>
  );
}
