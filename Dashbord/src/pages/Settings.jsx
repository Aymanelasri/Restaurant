import { useState } from 'react';

export default function Settings() {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError('كلمات المرور الجديدة غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('تم تغيير كلمة المرور بنجاح');
        setPasswordData({ old_password: '', new_password: '', new_password_confirmation: '' });
      } else {
        setError(data.message || 'خطأ في تغيير كلمة المرور');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="h3 fw-bold mb-4">Paramètres</h2>

      {/* Change Password Section */}
      <div className="card shadow-sm mb-4" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Changer le Mot de Passe</h5>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Mot de Passe Actuel</label>
              <input
                type="password"
                className="form-control"
                name="old_password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold">Nouveau Mot de Passe</label>
              <input
                type="password"
                className="form-control"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold">Confirmer le Nouveau Mot de Passe</label>
              <input
                type="password"
                className="form-control"
                name="new_password_confirmation"
                value={passwordData.new_password_confirmation}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Changer le Mot de Passe'}
            </button>
          </form>
        </div>
      </div>

      {/* Admin Info */}
      <div className="card shadow-sm" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Informations Administrateur</h5>
          <p><strong>Email:</strong> aymanelasri100@gmail.com</p>
          <p><strong>Rôle:</strong> Administrateur Système</p>
          <p><strong>Dernière Connexion:</strong> Maintenant</p>
        </div>
      </div>
    </div>
  );
}
