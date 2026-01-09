import { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const API_URL = 'http://localhost:8000/api';
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : [data]);
      } else {
        setError('Backend non disponible');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Backend non disponible');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center"><div className="spinner-border"></div></div>;
  }

  if (error) {
    return <div className="p-4"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="p-4">
      <h2 className="h3 fw-bold mb-4">Utilisateurs Connectés</h2>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3>{users.length}</h3>
              <p>Total Utilisateurs</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>{users.filter(u => u.email_verified_at).length}</h3>
              <p>Vérifiés</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3>{users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length}</h3>
              <p>Nouveaux Aujourd'hui</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3>{users.filter(u => {
                const created = new Date(u.created_at);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}</h3>
              <p>Ce Mois</p>
            </div>
          </div>
        </div>
      </div>

      {users.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold">Liste des Utilisateurs</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Date d'inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.email_verified_at ? 'bg-success' : 'bg-warning'
                        }`}>
                          {user.email_verified_at ? 'Vérifié' : 'En attente'}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}