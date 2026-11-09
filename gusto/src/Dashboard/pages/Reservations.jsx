import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDaysIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ApiService from '../services/apiService';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservationsData, tablesData] = await Promise.all([
        ApiService.getReservations(),
        ApiService.getTables(),
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
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const openActionMenu = (event, reservationId) => {
    event.preventDefault();
    event.stopPropagation();

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 120;
    const spaceBelow = window.innerHeight - buttonRect.bottom - 12;
    const left = Math.min(buttonRect.right - menuWidth, window.innerWidth - menuWidth - 12);
    const top = spaceBelow >= menuHeight
      ? buttonRect.bottom + 8
      : Math.max(12, buttonRect.top - menuHeight - 8);

    setOpenMenuId((current) => (current === reservationId ? null : reservationId));
    setMenuPosition({ left: Math.max(12, left), top: Math.max(12, top) });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    if (!openMenuId) return undefined;

    const handleOutsideClick = (event) => {
      const target = event.target;
      const clickedButton = target instanceof Element && target.closest(`[data-action-button="${openMenuId}"]`);
      const clickedMenu = target instanceof Element && target.closest(`[data-action-menu="${openMenuId}"]`);

      if (!clickedButton && !clickedMenu) {
        setOpenMenuId(null);
      }
    };

    const handleScrollOrResize = () => setOpenMenuId(null);

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [openMenuId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
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
            <span className="d-inline-flex align-items-center justify-content-center me-3" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,42,26,.12)', border: '1px solid rgba(255,42,26,.35)', color: '#ff2a1a' }}>
              <CalendarDaysIcon style={{ width: '22px', height: '22px' }} />
            </span>
            Reservations
          </h1>
          <p className="text-muted mb-0">Manage restaurant reservations</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">{reservations.length} Total</span>
          <span className="badge bg-success">{reservations.filter((r) => r.status === 'confirmed').length} Confirmed</span>
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
              <h3 className="fw-bold">{reservations.filter((r) => r.status === 'confirmed').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body">
              <h6 className="text-white-50">Pending</h6>
              <h3 className="fw-bold">{reservations.filter((r) => r.status === 'pending').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body">
              <h6 className="text-white-50">Available Tables</h6>
              <h3 className="fw-bold">{tables.filter((t) => t.status === 'available').length}</h3>
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
                      <span className="badge bg-light text-dark">Table {reservation.table_id}</span>
                    </td>
                    <td>
                      <span className={`badge bg-${getStatusColor(reservation.status)}`}>{reservation.status}</span>
                    </td>
                    <td>
                      <div className="position-relative">
                        <button
                          type="button"
                          data-action-button={reservation.id}
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          onClick={(event) => openActionMenu(event, reservation.id)}
                          aria-expanded={openMenuId === reservation.id}
                        >
                          Actions
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

      {reservations.map((reservation) =>
        openMenuId === reservation.id
          ? createPortal(
              <div
                data-action-menu={reservation.id}
                className="dropdown-menu show"
                style={{
                  position: 'fixed',
                  top: menuPosition.top,
                  left: menuPosition.left,
                  zIndex: 9999,
                  minWidth: '180px',
                  boxShadow: '0 18px 28px rgba(0, 0, 0, 0.45)',
                  padding: '0.35rem',
                  borderRadius: '12px',
                }}
              >
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                >
                  <CheckCircleIcon className="me-2" style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  Confirm
                </button>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                >
                  <XCircleIcon className="me-2" style={{ width: '16px', height: '16px', color: '#ff6b5e' }} />
                  Cancel
                </button>
              </div>,
              document.body,
            )
          : null,
      )}
    </div>
  );
}

export default Reservations;