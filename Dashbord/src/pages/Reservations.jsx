import { useState, useEffect } from "react";
import { testAPI } from '../services/testAPI.js';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:8000/api/reservations');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Reservations from database:', data);
      setReservations(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Backend gustobackend non disponible - Démarrez: php artisan serve');
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        loadReservations(); // Reload from database
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

  const today = new Date().toDateString();
  const todayReservations = reservations.filter(r => 
    new Date(r.date).toDateString() === today
  );

  return (
    <div className="p-4">
      <h2 className="h3 fw-bold mb-4">Gestion des Réservations</h2>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3>{reservations.length}</h3>
              <p>Total Réservations</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3>{todayReservations.length}</h3>
              <p>Aujourd'hui</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3>{reservations.filter(r => r.status === 'confirmed').length}</h3>
              <p>Confirmées</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>{reservations.filter(r => r.status === 'completed').length}</h3>
              <p>Terminées</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-bold">Liste des Réservations</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  
                  <th>Téléphone</th>
                  <th>Table</th>
                  
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td>#{reservation.id}</td>
                    <td>{reservation.name}</td>
                    <td>{reservation.phone}</td>
                    <td>Table {reservation.table?.number || reservation.table?.id || 'N/A'}</td>
                    <td>{new Date(reservation.date).toLocaleDateString()}</td>
                    <td>{reservation.time}</td>
                    <td>
                      <span className={`badge ${
                        reservation.status === 'pending' ? 'bg-warning' :
                        reservation.status === 'confirmed' ? 'bg-info' :
                        reservation.status === 'completed' ? 'bg-success' :
                        reservation.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      {reservation.status === 'completed' ? (
                        <span className="text-success fw-bold">✓ Terminée</span>
                      ) : (
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-info btn-sm"
                            onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            disabled={reservation.status !== 'pending'}
                          >
                            Confirmer
                          </button>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => updateReservationStatus(reservation.id, 'completed')}
                            disabled={reservation.status !== 'confirmed'}
                          >
                            Terminer
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            disabled={reservation.status === 'completed' || reservation.status === 'cancelled'}
                          >
                            Annuler
                          </button>
                        </div>
                      )}
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