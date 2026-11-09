import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reservation.css';

const TIME_SLOTS = [
  ['18:00', '6:00 PM'], ['18:30', '6:30 PM'], ['19:00', '7:00 PM'], ['19:30', '7:30 PM'],
  ['20:00', '8:00 PM'], ['20:30', '8:30 PM'], ['21:00', '9:00 PM'],
];

const formatDate = (iso) =>
  iso
    ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

export default function Reservation() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '' });

  const fetchTables = React.useCallback(async () => {
    try {
      const url = formData.date && formData.time
        ? `http://localhost:8000/api/tables?date=${formData.date}&time=${formData.time}`
        : 'http://localhost:8000/api/tables';

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setTables(await response.json());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setErrorMessage('Failed to load tables. Please make sure the server is running.');
      setLoading(false);
    }
  }, [formData.date, formData.time]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData || userData === 'undefined') {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);

      if (parsedUser.role === 'admin') {
        localStorage.clear();
        navigate('/login');
        return;
      }

      setUser(parsedUser);
      setFormData((prev) => ({ ...prev, name: prev.name || parsedUser.name || '' }));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
      return;
    }

    fetchTables();
  }, [navigate, fetchTables]);

  useEffect(() => {
    if (formData.date && formData.time) fetchTables();
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

  const pickTime = (value) => {
    setFormData({ ...formData, time: value });
    setSelectedTable(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.time) {
      setErrorMessage('Please choose a time for your reservation.');
      return;
    }
    if (!selectedTable) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          table_id: selectedTable.id,
        }),
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
        setFormData({ name: user?.name || '', phone: '', date: '', time: '' });
        setSelectedTable(null);
        fetchTables();
        setTimeout(() => setSuccessMessage(''), 5000);
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
  };


  if (loading) {
    return (
      <div className="reservation-page">
        <div className="rs-container"><div className="rs-state">Loading tables…</div></div>
      </div>
    );
  }

  if (errorMessage && tables.length === 0) {
    return (
      <div className="reservation-page">
        <div className="rs-container">
          <div className="rs-state rs-state--error" role="alert">
            <strong>Server connection error</strong>
            <p>{errorMessage}</p>
            <p>Please check your connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const stepDone = [
    Boolean(formData.date && formData.time),
    Boolean(selectedTable),
    Boolean(formData.name.trim() && formData.phone.trim()),
  ];
  const currentStep = stepDone.indexOf(false);
  const timeLabel = TIME_SLOTS.find(([v]) => v === formData.time)?.[1];
  const isRoyal = selectedTable?.type === 'royal';

  return (
    <div className="reservation-page">
      <div className="rs-container">
        <header className="rs-header">
          <div>
            <span className="rs-eyebrow">Reservations</span>
            <h1>Reserve your table</h1>
            <p className="rs-sub">Choose a time, pick your table, and we'll have it ready for you.</p>
          </div>
        </header>

        <ol className="rs-steps" aria-label="Booking progress">
          {['Date & time', 'Table', 'Your details'].map((label, i) => (
            <li key={label} className={`${stepDone[i] ? 'is-done' : ''} ${i === currentStep ? 'is-current' : ''}`}>
              <span className="rs-step-num">{stepDone[i] ? '✓' : i + 1}</span>
              <span className="rs-step-label">{label}</span>
            </li>
          ))}
        </ol>

        <form className="rs-layout" onSubmit={handleSubmit}>
          <div className="rs-main">
            {/* 1 — date & time */}
            <section className="rs-card">
              <div className="rs-card-head">
                <span className="rs-badge">1</span>
                <div>
                  <h2>Date &amp; time</h2>
                  <p>Open for today and the next two days, from 6:00 PM.</p>
                </div>
              </div>

              <label className="rs-label" htmlFor="rs-date">Date</label>
              <input
                id="rs-date"
                className="rs-input"
                type="date"
                value={formData.date}
                min={minDate}
                max={maxDate}
                required
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  setSelectedTable(null);
                }}
              />

              <span className="rs-label">Time</span>
              <div className="rs-slots" role="group" aria-label="Time">
                {TIME_SLOTS.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`rs-slot ${formData.time === value ? 'is-active' : ''}`}
                    aria-pressed={formData.time === value}
                    onClick={() => pickTime(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* 2 — table */}
            <section className="rs-card">
              <div className="rs-card-head">
                <span className="rs-badge">2</span>
                <div>
                  <h2>Choose your table</h2>
                  <p>
                    {formData.date && formData.time
                      ? 'Live availability for your selected time.'
                      : 'Select a date and time above to see live availability.'}
                  </p>
                </div>
              </div>

              <div className="rs-floor">
                {tables.map((table) => {
                  const classes = [
                    'rs-table',
                    `rs-table--${table.status}`,
                    table.type === 'royal' ? 'is-royal' : '',
                    selectedTable?.id === table.id ? 'is-selected' : '',
                  ].join(' ');
                  return (
                    <button
                      key={table.id}
                      type="button"
                      className={classes}
                      style={table.position}
                      aria-label={`Table ${table.id}, ${table.seats} seats, ${table.status}`}
                      aria-pressed={selectedTable?.id === table.id}
                      onClick={() => handleTableSelect(table)}
                    >
                      <span className="rs-table-no">{table.id}</span>
                      <span className="rs-table-seats">{table.seats} seats</span>
                      {table.type === 'royal' && <span className="rs-crown" aria-hidden="true">👑</span>}
                    </button>
                  );
                })}
              </div>

              <ul className="rs-legend">
                <li><i className="lg lg--available" />Available</li>
                <li><i className="lg lg--occupied" />Occupied</li>
                <li><i className="lg lg--selected" />Selected</li>
                <li><i className="lg lg--royal" />Royal (+$50)</li>
              </ul>
            </section>

            {/* 3 — details */}
            <section className="rs-card">
              <div className="rs-card-head">
                <span className="rs-badge">3</span>
                <div>
                  <h2>Your details</h2>
                  <p>We'll use these to confirm your booking.</p>
                </div>
              </div>

              <div className="rs-fields">
                <div>
                  <label className="rs-label" htmlFor="rs-name">Full name</label>
                  <input
                    id="rs-name"
                    className="rs-input"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="rs-label" htmlFor="rs-phone">Phone number</label>
                  <input
                    id="rs-phone"
                    className="rs-input"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    required
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* summary */}
          <aside className="rs-summary">
            <h2>Your reservation</h2>

            <dl className="rs-rows">
              <div><dt>Date</dt><dd>{formatDate(formData.date) || <em>Not selected</em>}</dd></div>
              <div><dt>Time</dt><dd>{timeLabel || <em>Not selected</em>}</dd></div>
              <div>
                <dt>Table</dt>
                <dd>
                  {selectedTable
                    ? <>Table {selectedTable.id} · {selectedTable.seats} seats{isRoyal && <span className="rs-tag">Royal</span>}</>
                    : <em>Not selected</em>}
                </dd>
              </div>
              <div><dt>Name</dt><dd>{formData.name || <em>—</em>}</dd></div>
              <div><dt>Phone</dt><dd>{formData.phone || <em>—</em>}</dd></div>
            </dl>

            {isRoyal && <p className="rs-note">A $50 royal table supplement applies to this booking.</p>}

            {successMessage && <div className="rs-msg rs-msg--ok" role="status">✓ {successMessage}</div>}
            {errorMessage && <div className="rs-msg rs-msg--err" role="alert">{errorMessage}</div>}

            <button type="submit" className="rs-confirm" disabled={!selectedTable}>
              Confirm reservation
            </button>
            {!selectedTable && <p className="rs-hint">Select a table to continue.</p>}
          </aside>
        </form>
      </div>
    </div>
  );
}