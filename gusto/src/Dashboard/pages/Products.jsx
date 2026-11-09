import React, { useState, useEffect } from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';
import ApiService from '../services/apiService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    available: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ApiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setImageFile(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
      available: true
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImageFile(null);
    setFormData(product);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalFormData = { ...formData };
      
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        const uploadResponse = await fetch('http://localhost:8000/api/products/upload-image', {
          method: 'POST',
          body: formDataUpload
        });
        
        const uploadData = await uploadResponse.json();
        finalFormData.image = uploadData.path;
      }
      
      if (editingProduct) {
        await ApiService.updateProduct(editingProduct.id, finalFormData);
      } else {
        await ApiService.createProduct(finalFormData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ApiService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Popular': return 'primary';
      case 'Italian': return 'success';
      case 'Mexican': return 'warning';
      case 'Japanese': return 'info';
      case 'Drinks': return 'secondary';
      default: return 'dark';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (value, product) => (
        <div>
          <div className="fw-semibold">{value}</div>
          <small className="text-muted">{product.description?.substring(0, 50)}...</small>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className={`badge bg-${getCategoryColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => <span className="fw-bold text-success">${value}</span>
    },
    {
      key: 'available',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${value ? 'bg-success' : 'bg-danger'}`}>
          {value ? 'Available' : 'Out of Stock'}
        </span>
      )
    }
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1 d-flex align-items-center">
            <span className="d-inline-flex align-items-center justify-content-center me-3" style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,42,26,.12)',border:'1px solid rgba(255,42,26,.35)',color:'#ff2a1a'}}>
              <CubeIcon style={{width:'22px',height:'22px'}} />
            </span>
            Products Management
          </h1>
          <p className="text-muted mb-0">Manage restaurant menu items</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body">
              <h6 className="text-white-50">Total Products</h6>
              <h3 className="fw-bold">{products.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body">
              <h6 className="text-white-50">Available</h6>
              <h3 className="fw-bold">{products.filter(p => p.available).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body">
              <h6 className="text-white-50">Categories</h6>
              <h3 className="fw-bold">{[...new Set(products.map(p => p.category))].length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body">
              <h6 className="text-white-50">Avg Price</h6>
              <h3 className="fw-bold">${products.length > 0 ? (products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toFixed(2) : '0.00'}</h3>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="All Products"
        loading={loading}
        filterOptions={{
          key: 'category',
          label: 'All Categories',
          options: [...new Set(products.map(p => p.category))]
        }}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Popular">Popular</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Japanese">Japanese</option>
                <option value="Drinks">Drinks</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Product Image</label>
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
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.available}
              onChange={(e) => setFormData({...formData, available: e.target.checked})}
            />
            <label className="form-check-label">Available</label>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Products;