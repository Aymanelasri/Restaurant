import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';

function Users() {
  const getStoredToken = useCallback(() => localStorage.getItem('auth_token') || localStorage.getItem('token') || '', []);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'customer' });

  const fetchUsers = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  }, [getStoredToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const token = getStoredToken();
      try {
        await fetch(`http://localhost:8000/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleView = (user) => {
    console.log('View clicked:', user);
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    console.log('Edit clicked:', user);
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    const token = getStoredToken();
    try {
      await fetch(`http://localhost:8000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAddUser = async () => {
    const token = getStoredToken();
    console.log('Adding user:', addForm);
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });
      const data = await response.json();
      console.log('Add response:', data);
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '', role: 'customer' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterRole === '' || user.role === filterRole)
  );

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-danger';
      case 'Moderator': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 p-md-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1">Users Management</h1>
          <p className="text-muted mb-0">Manage and monitor user accounts</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center w-100 w-md-auto justify-content-center" onClick={() => setShowAddModal(true)}>
          <PlusIcon style={{width: '18px', height: '18px'}} className="me-2" />
          Add New User
        </button>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body text-center py-3">
              <h4 className="fw-bold mb-0">{users.length}</h4>
              <small>Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body text-center py-3">
              <h4 className="fw-bold mb-0">{users.filter(u => u.role === 'admin').length}</h4>
              <small>Admins</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card border-0 bg-info text-white">
            <div className="card-body text-center py-3">
              <h4 className="fw-bold mb-0">{users.filter(u => u.role === 'customer').length}</h4>
              <small>Customers</small>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-6">
              <div className="position-relative">
                <MagnifyingGlassIcon className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{width: '18px', height: '18px'}} />
                <input
                  type="text"
                  placeholder="Search users by name..."
                  className="form-control ps-5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 fw-semibold">User</th>
                <th className="border-0 fw-semibold">Role</th>
                <th className="border-0 fw-semibold">Created</th>
                <th className="border-0 fw-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-medium me-3" style={{width: '40px', height: '40px', fontSize: '14px'}}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`badge ${getRoleBadgeColor(user.role)} rounded-pill`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-muted">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="d-flex justify-content-center gap-1">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        title="View"
                        onClick={() => handleView(user)}
                      >
                        <EyeIcon style={{width: '16px', height: '16px'}} />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-warning" 
                        title="Edit"
                        onClick={() => handleEdit(user)}
                      >
                        <PencilIcon style={{width: '16px', height: '16px'}} />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        title="Delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        <TrashIcon style={{width: '16px', height: '16px'}} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold" style={{width: '80px', height: '80px', fontSize: '32px'}}>
                    {selectedUser.name?.charAt(0)}
                  </div>
                </div>
                <table className="table">
                  <tbody>
                    <tr><th>Name:</th><td>{selectedUser.name}</td></tr>
                    <tr><th>Email:</th><td>{selectedUser.email}</td></tr>
                    <tr><th>Role:</th><td><span className="badge bg-primary">{selectedUser.role}</span></td></tr>
                    <tr><th>Created:</th><td>{new Date(selectedUser.created_at).toLocaleDateString()}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select 
                    className="form-select" 
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  >
                    <option value="customer">Customer</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateUser}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={addForm.name}
                    onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                    placeholder="Enter name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={addForm.email}
                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={addForm.password}
                    onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select 
                    className="form-select" 
                    value={addForm.role}
                    onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                  >
                    <option value="customer">Customer</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddUser}>Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;