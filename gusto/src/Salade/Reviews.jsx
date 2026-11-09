import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import './Reviews.css';

const reviews = [
  { name: 'Sarah L.', rating: 5, text: 'Fantastic food and friendly staff. The steak was perfect! The atmosphere is cozy and romantic.' },
  { name: 'Omar B.', rating: 4, text: 'Great flavors and cozy atmosphere. Will definitely come back with family. Highly recommended!' },
  { name: 'Nadia M.', rating: 5, text: 'Best dessert in town — the lava cake is unmissable. Service was exceptional and quick.' },
  { name: 'Ahmed K.', rating: 5, text: 'Amazing pasta and pizza! The ingredients taste so fresh. Perfect place for a date night.' },
  { name: 'Fatima R.', rating: 4, text: 'Lovely restaurant with great ambiance. The fish curry was delicious and well-presented.' },
  { name: 'Youssef T.', rating: 5, text: 'Outstanding service and incredible food quality. The chef really knows what they are doing!' },
];

export default function Reviews() {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleWriteReview = () => {
    if (!localStorage.getItem('token')) navigate('/login');
    else setShowForm(true);
  };

  const handleSubmitReview = async () => {
    if (!newReview.text.trim()) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.text,
          user_name: user.name || 'Anonymous',
        }),
      });
    } catch (error) {
      console.error('Network error:', error);
    }

    setSuccessMessage('✅ Merci pour votre avis!');
    setShowForm(false);
    setNewReview({ rating: 5, text: '' });
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const cancel = () => {
    setNewReview({ rating: 5, text: '' });
    setShowForm(false);
  };

  return (
    <>
      <section className="rv-page">
        <div className="rv-wrap">
          <header className="rv-head">
            <h2>Customer Reviews</h2>
            <p>What our valued customers say about their dining experience</p>
          </header>

          <div className="rv-list">
            {reviews.map((r) => (
              <div key={r.name} className="rv-card">
                <strong>{r.name}</strong>
                <div className="rv-stars" aria-label={`${r.rating} out of 5`}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <p>"{r.text}"</p>
                <div className="rv-verified">Verified Customer</div>
              </div>
            ))}
          </div>

          <div className="rv-form">
            <h3>Share Your Experience</h3>
            <p>We'd love to hear about your visit! Leave us a review and help others discover great food.</p>

            {successMessage && <div className="rv-ok">{successMessage}</div>}

            {!showForm ? (
              <button type="button" className="rv-btn" onClick={handleWriteReview}>Write a Review</button>
            ) : (
              <div className="rv-fields">
                <label>Rating</label>
                <div className="rv-pick">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={s <= newReview.rating ? 'on' : ''}
                      aria-label={`${s} stars`}
                      onClick={() => setNewReview({ ...newReview, rating: s })}
                    >★</button>
                  ))}
                </div>
                <label htmlFor="rv-text">Your Review</label>
                <textarea
                  id="rv-text"
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  placeholder="Share your experience with us..."
                />
                <div className="rv-actions">
                  <button type="button" className="rv-btn" onClick={handleSubmitReview} disabled={!newReview.text.trim()}>Submit Review</button>
                  <button type="button" className="rv-btn ghost" onClick={cancel}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}