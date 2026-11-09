import React, { useState, useEffect } from 'react';
import { ShoppingBagIcon, FireIcon, CheckCircleIcon, TruckIcon } from '@heroicons/react/24/outline';
import ApiService from '../services/apiService';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await ApiService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await ApiService.updateOrder(id, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'confirmed': return 'success';
      case 'delivered': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'primary';
    }
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + parseFloat(order.total_amount || 0), 0).toFixed(2);
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
              <ShoppingBagIcon style={{width:'22px',height:'22px'}} />
            </span>
            Orders
          </h1>
          <p className="text-muted mb-0">Manage restaurant orders</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">{orders.length} Total Orders</span>
          <span className="badge bg-success">${getTotalRevenue()} Revenue</span>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body">
              <h6 className="text-white-50">Total Orders</h6>
              <h3 className="fw-bold">{orders.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body">
              <h6 className="text-white-50">Revenue</h6>
              <h3 className="fw-bold">${getTotalRevenue()}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body">
              <h6 className="text-white-50">Pending</h6>
              <h3 className="fw-bold">{orders.filter(o => o.status === 'pending').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body">
              <h6 className="text-white-50">Delivered</h6>
              <h3 className="fw-bold">{orders.filter(o => o.status === 'delivered').length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <h5 className="fw-semibold mb-0">All Orders</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 fw-semibold">Order ID</th>
                  <th className="border-0 fw-semibold">Customer</th>
                  <th className="border-0 fw-semibold">Items</th>
                  <th className="border-0 fw-semibold">Total</th>
                  <th className="border-0 fw-semibold">Status</th>
                  <th className="border-0 fw-semibold">Date</th>
                  <th className="border-0 fw-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="fw-medium">#{order.id}</td>
                    <td>
                      <div>
                        <div className="fw-semibold">{order.customer_name}</div>
                        <small className="text-muted">{order.customer_phone}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        {order.items && Array.isArray(order.items) ? order.items.map((item, index) => (
                          <div key={index} className="small">
                            {item.name} x{item.quantity}
                          </div>
                        )) : 'No items'}
                      </div>
                    </td>
                    <td className="fw-bold text-success">${order.total_amount}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div className={`dropdown ${index >= orders.length - 2 ? 'dropup' : ''}`}>
                        <button
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          data-bs-toggle="dropdown"
                          data-bs-config='{"popperConfig":{"strategy":"fixed"}}'
                        >
                          Update
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                            >
                              <FireIcon className="me-2" style={{width:'16px',height:'16px',color:'currentColor'}} />
                              Preparing
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            >
                              <CheckCircleIcon className="me-2" style={{width:'16px',height:'16px',color:'#22c55e'}} />
                              Confirmed
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                            >
                              <TruckIcon className="me-2" style={{width:'16px',height:'16px',color:'currentColor'}} />
                              Delivered
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;