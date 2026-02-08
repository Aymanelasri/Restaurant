import React, { useState, useEffect } from 'react';
import ApiService from '../services/apiService';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservationsData, tablesData] = await Promise.all([
        ApiService.getReservations(),
        ApiService.getTables()
      ]);
      setReservations(reservationsData);
      setTables(tablesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await ApiService.updateReservation(id, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
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
          <h1 className="h2 fw-bold text-primary mb-1">📅 Reservations</h1>
          <p className="text-muted mb-0">Manage restaurant reservations</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">{reservations.length} Total</span>
          <span className="badge bg-success">{reservations.filter(r => r.status === 'confirmed').length} Confirmed</span>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body">
              <h6 className="text-white-50">Total Reservations</h6>
              <h3 className="fw-bold">{reservations.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body">
              <h6 className="text-white-50">Confirmed</h6>
              <h3 className="fw-bold">{reservations.filter(r => r.status === 'confirmed').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body">
              <h6 className="text-white-50">Pending</h6>
              <h3 className="fw-bold">{reservations.filter(r => r.status === 'pending').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body">
              <h6 className="text-white-50">Available Tables</h6>
              <h3 className="fw-bold">{tables.filter(t => t.status === 'available').length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <h5 className="fw-semibold mb-0">All Reservations</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 fw-semibold">ID</th>
                  <th className="border-0 fw-semibold">Customer</th>
                  <th className="border-0 fw-semibold">Date & Time</th>
                  <th className="border-0 fw-semibold">Table</th>
                  <th className="border-0 fw-semibold">Status</th>
                  <th className="border-0 fw-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="fw-medium">#{reservation.id}</td>
                    <td>
                      <div>
                        <div className="fw-semibold">{reservation.name}</div>
                        <small className="text-muted">{reservation.phone}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{new Date(reservation.date).toLocaleDateString()}</div>
                        <small className="text-muted">{reservation.time}</small>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        Table {reservation.table_id}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          Actions
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            >
                              ✅ Confirm
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            >
                              ❌ Cancel
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

export default Reservations;