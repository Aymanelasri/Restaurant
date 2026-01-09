import React, { useState, useEffect } from 'react';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([
    {
      _id: 1,
      userName: 'Ahmed Benali',
      rating: 5,
      text: 'Excellent service et nourriture délicieuse! Je recommande vivement ce restaurant.',
      date: new Date().toISOString(),
      status: 'pending'
    },
    {
      _id: 2,
      userName: 'Fatima Zahra',
      rating: 4,
      text: 'Très bon restaurant, ambiance agréable. Le tajine était parfait!',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'approved'
    },
    {
      _id: 3,
      userName: 'Omar Alami',
      rating: 5,
      text: 'Une expérience culinaire exceptionnelle. Le personnel est très accueillant.',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'pending'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, text: '' });

  useEffect(() => {
    loadReviewsFromLaravel();
    // Check for new reviews every 3 seconds
    const interval = setInterval(loadReviewsFromLaravel, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadReviewsFromLaravel = async () => {
    try {
      console.log('Loading reviews from Laravel...');
      const response = await fetch('http://localhost:8000/api/reviews', {
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews from Laravel database:', data);
        
        // Check for new reviews
        if (reviews.length > 0 && data.length > reviews.length) {
          setNotification('✅ Nouveau commentaire reçu!');
          setTimeout(() => setNotification(''), 3000);
        }
        
        setReviews(data);
      } else {
        console.log('Laravel backend not responding');
      }
    } catch (error) {
      console.log('Laravel backend not available:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews from Laravel...');
      const response = await fetch('http://localhost:8000/api/reviews', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews received from Laravel:', data);
        
        // Check for new reviews
        if (reviews.length > 0 && data.length > reviews.length) {
          setNotification('✅ Nouveau commentaire reçu!');
          setTimeout(() => setNotification(''), 3000);
        }
        
        setReviews(data);
      } else {
        console.log('Laravel backend not available, using local data');
      }
    } catch (error) {
      console.log('Laravel backend not connected, using local reviews');
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    // Try Laravel first
    try {
      const response = await fetch(`http://localhost:8000/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        loadReviews();
        return;
      }
    } catch (error) {
      console.log('Laravel not available, updating localStorage');
    }
    
    // Fallback to localStorage
    const savedReviews = JSON.parse(localStorage.getItem('allReviews') || '[]');
    const updatedReviews = savedReviews.map(review => 
      review.id === reviewId ? { ...review, status } : review
    );
    localStorage.setItem('allReviews', JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
  };

  const addReview = () => {
    if (!newReview.userName.trim() || !newReview.text.trim()) return;
    
    const review = {
      _id: Date.now(),
      ...newReview,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ userName: '', rating: 5, text: '' });
    setShowAddForm(false);
    setNotification('✅ Commentaire ajouté!');
    setTimeout(() => setNotification(''), 3000);
  };

  // Simulate receiving review from website
  const simulateWebsiteReview = () => {
    const websiteReview = {
      _id: Date.now(),
      userName: 'Client du Site Web',
      rating: Math.floor(Math.random() * 5) + 1,
      text: 'Commentaire soumis depuis le site web du restaurant.',
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    setReviews([websiteReview, ...reviews]);
    setNotification('✅ Nouveau commentaire reçu du site web!');
    setTimeout(() => setNotification(''), 3000);
  };

  if (loading) return <div className="text-center p-4">Chargement...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Commentaires</h2>
        <div>
          <button 
            className="btn btn-info me-2"
            onClick={simulateWebsiteReview}
          >
            🌐 Simuler Review Site
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + Ajouter Commentaire
          </button>
        </div>
      </div>
      
      {notification && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {notification}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification('')}
          ></button>
        </div>
      )}
      
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Ajouter un nouveau commentaire</h5>
            <div className="row">
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control mb-3" 
                  placeholder="Nom du client"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                />
              </div>
              <div className="col-md-2">
                <select 
                  className="form-select mb-3"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <textarea 
                  className="form-control mb-3" 
                  placeholder="Commentaire..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                />
              </div>
            </div>
            <div>
              <button className="btn btn-success me-2" onClick={addReview}>Ajouter</button>
              <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="row">
        {reviews.map(review => (
          <div key={review.id || review._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="card-title">{review.userName}</h6>
                  <span className={`badge ${
                    review.status === 'approved' ? 'bg-success' : 
                    review.status === 'rejected' ? 'bg-danger' : 'bg-warning'
                  }`}>
                    {review.status === 'approved' ? 'Approuvé' : 
                     review.status === 'rejected' ? 'Rejeté' : 'En attente'}
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="text-warning">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                  </span>
                </div>
                
                <p className="card-text">{review.text}</p>
                
                <small className="text-muted">
                  {new Date(review.date).toLocaleDateString('fr-FR')}
                </small>
                
                {review.status === 'pending' && (
                  <div className="mt-3 d-flex gap-2">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => updateReviewStatus(review.id || review._id, 'approved')}
                    >
                      Approuver
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => updateReviewStatus(review.id || review._id, 'rejected')}
                    >
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {reviews.length === 0 && (
        <div className="text-center text-muted">
          Aucun commentaire pour le moment
        </div>
      )}
    </div>
  );
}