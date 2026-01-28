import { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, reservations: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Test direct fetch without authentication
      const ordersResponse = await fetch('http://localhost:8000/api/orders');
      const reservationsResponse = await fetch('http://localhost:8000/api/reservations');
      
      const orders = ordersResponse.ok ? await ordersResponse.json() : [];
      const reservations = reservationsResponse.ok ? await reservationsResponse.json() : [];
      
      console.log('Orders:', orders);
      console.log('Reservations:', reservations);
      
      setOrders(Array.isArray(orders) ? orders : []);
      setReservations(Array.isArray(reservations) ? reservations : []);

      // Calculate revenue from real data
      const revenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

      setStats({
        users: 0,
        orders: orders.length,
        reservations: reservations.length,
        revenue: revenue
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Backend gustobackend non démarré - Lancez: php artisan serve');
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
      <h2 className="h3 fw-bold mb-4">Tableau de Bord</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3>{stats.users}</h3>
              <p>Total Utilisateurs</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>{stats.orders}</h3>
              <p>Total Commandes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3>{stats.reservations}</h3>
              <p>Total Réservations</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3>${stats.revenue.toFixed(2)}</h3>
              <p>Chiffre d'Affaires</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and Reservations */}
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold">Commandes Récentes</h5>
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <strong>{order.customer_name}</strong><br/>
                    <small className="text-muted">{order.customer_phone}</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${
                      order.status === 'pending' ? 'bg-warning' :
                      order.status === 'preparing' ? 'bg-info' :
                      order.status === 'delivered' ? 'bg-success' : 'bg-secondary'
                    }`}>
                      {order.status}
                    </span><br/>
                    <small className="text-muted">${order.total_amount}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold">Réservations Récentes</h5>
              <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                {reservations.slice(0, 5).map(reservation => (
                  <div key={reservation.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <strong>{reservation.name}</strong><br/>
                      <small className="text-muted">Table {reservation.table?.number || reservation.table_id} - {reservation.guests || 'N/A'} personnes</small>
                    </div>
                    <div className="text-end">
                      <small className="text-muted">{new Date(reservation.date).toLocaleDateString()}</small><br/>
                      <span className={`badge ${
                        reservation.status === 'pending' ? 'bg-warning' :
                        reservation.status === 'confirmed' ? 'bg-info' :
                        reservation.status === 'completed' ? 'bg-success' : 'bg-secondary'
                      } badge-sm`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
