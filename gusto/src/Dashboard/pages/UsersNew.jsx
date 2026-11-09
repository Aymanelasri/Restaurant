import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, EyeIcon, UsersIcon } from '@heroicons/react/24/outline';
import ApiService from '../services/apiService';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await ApiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await ApiService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterRole === '' || user.role === filterRole) &&
    (filterStatus === '' || user.status === filterStatus)
  );

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-danger';
      case 'staff': return 'bg-warning';
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
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1 d-flex align-items-center">
            <span className="d-inline-flex align-items-center justify-content-center me-3" style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,42,26,.12)',border:'1px solid rgba(255,42,26,.35)',color:'#ff2a1a'}}>
              <UsersIcon style={{width:'22px',height:'22px'}} />
            </span>
            Users Management
          </h1>
          <p className="text-muted mb-0">Manage and monitor user accounts</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center">
          <PlusIcon style={{width: '18px', height: '18px'}} className="me-2" />
          Add New User
        </button>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body text-center py-3">
              <h4 className="fw-bold mb-0">{users.length}</h4>
              <small>Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body text-center py-3">
              <h4 className="fw-bold mb-0">{users.filter(u => u.role === 'customer').length}</h4>
              <small>Customers</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body text-center py-3">
              <h4 className="fw-bold mb-0">{users.filter(u => u.role === 'admin').length}</h4>
              <small>Admins</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body text-center py-3">
              <h4 className="fw-bold mb-0">{users.filter(u => u.role === 'staff').length}</h4>
              <small>Staff</small>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
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
            <div className="col-12 col-md-3 col-lg-2">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
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
                <th className="border-0 fw-semibold">Join Date</th>
                <th className="border-0 fw-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-medium me-3" style={{width: '40px', height: '40px', fontSize: '14px'}}>
                        {user.name.charAt(0).toUpperCase()}
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
                  <td className="py-3 text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <div className="d-flex justify-content-center gap-1">
                      <button className="btn btn-sm btn-outline-primary" title="View">
                        <EyeIcon style={{width: '16px', height: '16px'}} />
                      </button>
                      <button className="btn btn-sm btn-outline-warning" title="Edit">
                        <PencilIcon style={{width: '16px', height: '16px'}} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => deleteUser(user.id)}>
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
    </div>
  );
}

export default Users;