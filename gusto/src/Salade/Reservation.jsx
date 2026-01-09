import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reservation.css';

export default function Reservation() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    
  });

  const fetchTables = React.useCallback(async () => {
    try {
      const url = formData.date && formData.time 
        ? `http://localhost:8000/api/tables?date=${formData.date}&time=${formData.time}`
        : 'http://localhost:8000/api/tables';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTables(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setErrorMessage('Failed to load tables. Please make sure the server is running.');
      setLoading(false);
    }
  }, [formData.date, formData.time]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchTables();
  }, [navigate, fetchTables]);

  useEffect(() => {
    if (formData.date && formData.time) {
      fetchTables();
    }
  }, [formData.date, formData.time, fetchTables]);

  const handleTableSelect = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
      setErrorMessage('');
    } else if (table.status === 'occupied') {
      setErrorMessage('This table is currently occupied. Please select another table.');
    }
  };

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTable) {
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch('http://localhost:8000/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            date: formData.date,
            time: formData.time,
            table_id: selectedTable.id
          })
        });
        
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          setErrorMessage('Server error - please try again');
          setSuccessMessage('');
          return;
        }
        
        if (response.ok) {
          setSuccessMessage('Thank you! Your reservation has been submitted successfully.');
          setErrorMessage('');
          setFormData({ name: '', phone: '', date: '', time: '' });
          setSelectedTable(null);
          fetchTables();
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(''), 3000);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else if (response.status === 422) {
          setErrorMessage(result.message || 'Table not available at this time');
          setSuccessMessage('');
        } else {
          console.error('Server response:', result);
          setErrorMessage('Error creating reservation: ' + (result.message || 'Unknown error'));
          setSuccessMessage('');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Error creating reservation');
        setSuccessMessage('');
      }
    }
  };

  if (loading) {
    return <div className="reservation-page"><div className="reservation-container"><h1>Loading tables...</h1></div></div>;
  }

  if (errorMessage && tables.length === 0) {
    return (
      <div className="reservation-page">
        <div className="reservation-container">
          <div className="reservation-header">
            <h1>Server Connection Error</h1>
          </div>
          <div className="error-message">
            <p>❌ {errorMessage}</p>
            <p>❌ Please check your internet connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <div className="reservation-header">
          <h1>Make Your Reservation</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </div>
        
        <div className="reservation-content">
          <div className="restaurant-layout">
            <h3>Select Your Table</h3>
            <div className="floor-plan">
              {tables.map(table => (
                <div
                  key={table.id}
                  className={`table ${table.status} ${table.type === 'royal' ? 'royal' : ''} ${selectedTable?.id === table.id ? 'selected' : ''}`}
                  style={table.position}
                  onClick={() => handleTableSelect(table)}
                >
                  <div className="table-number">{table.id}</div>
                  <div className="table-seats">{table.seats} seats</div>
                  {table.type === 'royal' && <div className="royal-badge">👑</div>}
                </div>
              ))}
            </div>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-color occupied"></div>
                <span>Occupied</span>
              </div>
              <div className="legend-item">
                <div className="legend-color selected"></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="legend-color royal"></div>
                <span>👑 Royal (+$50)</span>
              </div>
            </div>
          </div>

          <div className="reservation-form">
            <h3>Reservation Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({...formData, date: e.target.value});
                      setSelectedTable(null);
                    }}
                    min={minDate}
                    max={maxDate}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <select
                    value={formData.time}
                    onChange={(e) => {
                      setFormData({...formData, time: e.target.value});
                      setSelectedTable(null);
                    }}
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
              </div>

            

              {successMessage && (
                <div className="success-message">
                  <p>✅ {successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className="error-message">
                  <p>❌ {errorMessage}</p>
                </div>
              )}

              {selectedTable && (
                <div className="selected-table-info">
                  <p>✅ Selected: Table {selectedTable.id} ({selectedTable.seats} seats)</p>
                </div>
              )}

              <button 
                type="submit" 
                className="reserve-btn"
                disabled={!selectedTable}
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}