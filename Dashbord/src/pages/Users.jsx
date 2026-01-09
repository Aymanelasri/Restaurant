import { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const pageSize = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const API = 'http://localhost:8000/api';

  const loadUsers = async () => {
    try {
      console.log('Fetching users from:', `${API}/users`);
      const response = await fetch(`${API}/users`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error('Backend non disponible');
      const data = await response.json();
      console.log('Users data:', data);
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Backend non disponible');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser 
      ? `${API}/users/${editingUser.id}`
      : `${API}/register`;
    const method = editingUser ? 'PUT' : 'POST';
    
    const body = editingUser 
      ? { email: formData.email, role: formData.role }
      : { name: formData.email.split('@')[0], email: formData.email, password: formData.password, password_confirmation: formData.password, role: formData.role };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setMessage(editingUser ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès');
        setShowModal(false);
        setEditingUser(null);
        setFormData({ email: '', password: '', role: 'user' });
        loadUsers();
      } else {
        setError('Erreur lors de l\'opération');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email || '',
      password: '',
      role: user.role || 'user'
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;

    try {
      const res = await fetch(`${API}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setMessage('Utilisateur supprimé avec succès');
        loadUsers();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'user' });
    setShowModal(true);
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  if (loading) {
    return <div className="p-4 text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 fw-bold">Utilisateurs ({users.length})</h2>
        <button className="btn btn-success" onClick={openCreateModal}>
          + Créer Utilisateur
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <input
        type="text"
        placeholder="Rechercher utilisateurs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="form-control mb-4"
      />
      
      {users.length === 0 ? (
        <div className="alert alert-info">Aucun utilisateur trouvé</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Créé le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{u.role}</span></td>
                    <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-warning btn-sm me-2" 
                        onClick={() => handleEdit(u)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(u.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 d-flex justify-content-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Modifier Utilisateur' : 'Créer Utilisateur'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rôle</label>
                    <select
                      className="form-control"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      required
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                      <option value="instructor">Instructeur</option>
                    </select>
                  </div>
                  {!editingUser && (
                    <div className="mb-3">
                      <label className="form-label">Mot de passe</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}