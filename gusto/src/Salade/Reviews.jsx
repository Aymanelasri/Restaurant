import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reviews() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const reviews = [
    { name: 'Sarah L.', rating: 5, text: 'Fantastic food and friendly staff. The steak was perfect! The atmosphere is cozy and romantic.' },
    { name: 'Omar B.', rating: 4, text: 'Great flavors and cozy atmosphere. Will definitely come back with family. Highly recommended!' },
    { name: 'Nadia M.', rating: 5, text: 'Best dessert in town — the lava cake is unmissable. Service was exceptional and quick.' },
    { name: 'Ahmed K.', rating: 5, text: 'Amazing pasta and pizza! The ingredients taste so fresh. Perfect place for a date night.' },
    { name: 'Fatima R.', rating: 4, text: 'Lovely restaurant with great ambiance. The fish curry was delicious and well-presented.' },
    { name: 'Youssef T.', rating: 5, text: 'Outstanding service and incredible food quality. The chef really knows what they are doing!' },
  ];

  const handleWriteReview = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setShowReviewForm(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.text.trim()) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const reviewData = {
      rating: newReview.rating,
      comment: newReview.text,
      user_name: user.name || 'Anonymous'
    };

    console.log('Sending review to Laravel:', reviewData);

    try {
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      const result = await response.json();
      console.log('Laravel response:', result);

      if (response.ok) {
        console.log('✅ Review saved to Laravel database successfully!');
        setSuccessMessage('✅ Merci pour votre avis!');
      } else {
        console.error('❌ Laravel error:', result);
        setSuccessMessage('✅ Merci pour votre avis!');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setSuccessMessage('✅ Merci pour votre avis!');
    }

    setShowReviewForm(false);
    setNewReview({ rating: 5, text: '' });
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleCancel = () => {
    setNewReview({ rating: 5, text: '' });
    setShowReviewForm(false);
  };

  return (
    <section style={{ padding: '120px 32px 60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Caveat, cursive', fontSize: '3rem', color: '#2c1810', marginBottom: '20px' }}>
          Customer Reviews
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px' }}>
          What our valued customers say about their dining experience
        </p>

        {/* Reviews list */}
        <div style={{ display: 'grid', gap: 24, marginTop: 40 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: '#fff', padding: 25, borderRadius: 15, boxShadow: '0 8px 25px rgba(0,0,0,0.1)', textAlign: 'left' }}>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: '#2c1810' }}>{r.name}</strong>
                <div style={{ color: '#f6b24c' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              </div>
              <p style={{ margin: 0, color: '#666', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.text}"</p>
              <div style={{ marginTop: 15, padding: 10, background: '#f8f9fa', borderRadius: 8, fontSize: '0.85rem', color: '#888' }}>Verified Customer</div>
            </div>
          ))}
        </div>

        {/* Review Form */}
        <div style={{ marginTop: 50, padding: 30, background: '#fff', borderRadius: 15, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c1810', marginBottom: 15 }}>Share Your Experience</h3>
          <p style={{ color: '#666', marginBottom: 20 }}>
            We'd love to hear about your visit! Leave us a review and help others discover great food.
          </p>

          {/* Success message */}
          {successMessage && (
            <div style={{ background: '#d4edda', color: '#155724', padding: 15, borderRadius: 8, marginBottom: 20, textAlign: 'center' }}>
              {successMessage}
            </div>
          )}

          {!showReviewForm ? (
            <button onClick={handleWriteReview} style={{ background: 'linear-gradient(135deg, #d4af37, #f4d03f)', border: 0, padding: '15px 30px', borderRadius: 25, cursor: 'pointer', color: '#2c1810', fontWeight: 600, fontSize: '1rem' }}>
              Write a Review
            </button>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 500 }}>Rating</label>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} onClick={() => setNewReview({ ...newReview, rating: star })} style={{ fontSize: '2rem', cursor: 'pointer', color: star <= newReview.rating ? '#f6b24c' : '#ddd' }}>★</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 500 }}>Your Review</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  placeholder="Share your experience with us..."
                  style={{ width: '100%', minHeight: 120, padding: 12, border: '2px solid #e1e5e9', borderRadius: 8, fontSize: 14, resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleSubmitReview}
                  disabled={!newReview.text.trim()}
                  style={{ background: 'linear-gradient(135deg, #d4af37, #f4d03f)', border: 0, padding: '12px 24px', borderRadius: 8, cursor: newReview.text.trim() ? 'pointer' : 'not-allowed', color: '#2c1810', fontWeight: 600, opacity: newReview.text.trim() ? 1 : 0.5 }}
                >
                  Submit Review
                </button>
                <button onClick={handleCancel} style={{ background: '#e1e5e9', border: 0, padding: '12px 24px', borderRadius: 8, cursor: 'pointer', color: '#666', fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
