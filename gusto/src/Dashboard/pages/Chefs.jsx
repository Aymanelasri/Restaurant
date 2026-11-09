import React, { useState, useEffect } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import ApiService from '../services/apiService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChef, setEditingChef] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience_years: '',
    rating: '',
    status: 'active',
    orders_today: 0,
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const data = await ApiService.getChefs();
      setChefs(data);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingChef(null);
    setImageFile(null);
    setFormData({
      name: '',
      specialty: '',
      experience_years: '',
      rating: '',
      status: 'active',
      orders_today: 0,
      image: ''
    });
    setShowModal(true);
  };

  const handleEdit = (chef) => {
    setEditingChef(chef);
    setImageFile(null);
    setFormData(chef);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalFormData = { ...formData };
      
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        const uploadResponse = await fetch('http://localhost:8000/api/chefs/upload-image', {
          method: 'POST',
          body: formDataUpload
        });
        
        const uploadData = await uploadResponse.json();
        finalFormData.image = uploadData.path;
      }
      
      if (editingChef) {
        await ApiService.updateChef(editingChef.id, finalFormData);
      } else {
        await ApiService.createChef(finalFormData);
      }
      setShowModal(false);
      fetchChefs();
    } catch (error) {
      console.error('Error saving chef:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chef?')) {
      try {
        await ApiService.deleteChef(id);
        fetchChefs();
      } catch (error) {
        console.error('Error deleting chef:', error);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, chef) => (
        <div className="d-flex align-items-center">
          <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white fw-medium me-3" 
               style={{width: '40px', height: '40px'}}>
            {value.charAt(0)}
          </div>
          <div>
            <div className="fw-semibold">{value}</div>
            <small className="text-muted">{chef.specialty}</small>
          </div>
        </div>
      )
    },
    {
      key: 'experience_years',
      label: 'Experience',
      sortable: true,
      render: (value) => `${value} years`
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="d-flex align-items-center">
          <span className="text-warning me-1">★</span>
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge bg-${value === 'active' ? 'success' : value === 'break' ? 'warning' : 'secondary'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'orders_today',
      label: 'Orders Today',
      sortable: true
    }
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1 d-flex align-items-center">
            <span className="d-inline-flex align-items-center justify-content-center me-3" style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,42,26,.12)',border:'1px solid rgba(255,42,26,.35)',color:'#ff2a1a'}}>
              <UserGroupIcon style={{width:'22px',height:'22px'}} />
            </span>
            Chefs Management
          </h1>
          <p className="text-muted mb-0">Manage restaurant chefs and their specialties</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body">
              <h6 className="text-white-50">Total Chefs</h6>
              <h3 className="fw-bold">{chefs.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body">
              <h6 className="text-white-50">Active</h6>
              <h3 className="fw-bold">{chefs.filter(c => c.status === 'active').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body">
              <h6 className="text-white-50">On Break</h6>
              <h3 className="fw-bold">{chefs.filter(c => c.status === 'break').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body">
              <h6 className="text-white-50">Avg Rating</h6>
              <h3 className="fw-bold">
                {chefs.length > 0 ? (chefs.reduce((sum, c) => sum + parseFloat(c.rating), 0) / chefs.length).toFixed(1) : '0.0'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={chefs}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="All Chefs"
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingChef ? 'Edit Chef' : 'Add New Chef'}
      >
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Specialty</label>
            <input
              type="text"
              className="form-control"
              value={formData.specialty}
              onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                className="form-control"
                value={formData.experience_years}
                onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="form-control"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="break">On Break</option>
              <option value="off">Off Duty</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Chef Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {(formData.image || imageFile) && (
              <small className="text-muted d-block mt-1">
                {imageFile ? `Selected: ${imageFile.name}` : `Current: ${formData.image}`}
              </small>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingChef ? 'Update' : 'Create'} Chef
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Chefs;