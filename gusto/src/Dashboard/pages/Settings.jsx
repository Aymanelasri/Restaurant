import React, { useState } from 'react';
import { ShieldCheckIcon, BellIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline';

function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('account');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'admin'
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    sessionTimeout: '30'
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          new_password_confirmation: passwordData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const updatedUser = { ...user, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1">Settings</h1>
          <p className="text-muted mb-0">Manage your account preferences</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 ${
                      activeTab === tab.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="me-3" style={{width: '20px', height: '20px'}} />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {activeTab === 'account' && (
                <div>
                  <h5 className="fw-semibold mb-4">Account Information</h5>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row g-4">
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-medium">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-medium">Role</label>
                        <input
                          type="text"
                          value={profile.role}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h5 className="fw-semibold mb-4">Security Settings</h5>
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <h6 className="fw-semibold mb-3">Password</h6>
                          <p className="text-muted mb-3">Change your account password</p>
                          <button 
                            className="btn btn-primary"
                            onClick={() => setShowPasswordModal(true)}
                          >
                            <KeyIcon className="me-2" style={{width: '16px', height: '16px'}} />
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-semibold mb-1">Two-Factor Authentication</h6>
                              <p className="text-muted mb-0 small">Add extra security layer</p>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                type="checkbox"
                                name="twoFactorAuth"
                                checked={settings.twoFactorAuth}
                                onChange={handleSettingsChange}
                                className="form-check-input"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h5 className="fw-semibold mb-4">Notification Preferences</h5>
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <h6 className="fw-semibold mb-1">Email Notifications</h6>
                              <p className="text-muted mb-0 small">Receive notifications via email</p>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.emailNotifications}
                                onChange={handleSettingsChange}
                                className="form-check-input"
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-semibold mb-1">Push Notifications</h6>
                              <p className="text-muted mb-0 small">Receive push notifications</p>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                type="checkbox"
                                name="pushNotifications"
                                checked={settings.pushNotifications}
                                onChange={handleSettingsChange}
                                className="form-check-input"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                      minLength="6"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                      minLength="6"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Change Password</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowPasswordModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
