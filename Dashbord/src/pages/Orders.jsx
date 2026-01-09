import { useState, useEffect } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API}/orders`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadOrders();
      }
    } catch (err) {
      console.error('Error updating status:', err);
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
      <h2 className="h3 fw-bold mb-4">Gestion des Commandes</h2>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3>{orders.length}</h3>
              <p>Total Commandes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3>{orders.filter(o => o.status === 'pending').length}</h3>
              <p>En Attente</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3>{orders.filter(o => o.status === 'preparing').length}</h3>
              <p>En Préparation</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>{orders.filter(o => o.status === 'delivered').length}</h3>
              <p>Livrées</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-bold">Liste des Commandes</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_phone}</td>
                    <td>{order.delivery_address}</td>
                    <td>${order.total_amount}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'pending' ? 'bg-warning' :
                        order.status === 'preparing' ? 'bg-info' :
                        order.status === 'delivered' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          disabled={order.status !== 'pending'}
                        >
                          Préparer
                        </button>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          disabled={order.status === 'delivered'}
                        >
                          Livrer
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
    </div>
  );
}