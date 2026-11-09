import React from 'react';

// variant: 'red' (default) or 'gold'. The old `color` prop is still accepted but ignored,
// so existing pages keep working without changes.
function StatCard({ title, value, icon: Icon, variant = 'red' }) {
  return (
    <div className="card stat-card accent-top">
      <div className="card-body d-flex align-items-center p-4">
        <div className={`stat-icon ${variant === 'gold' ? 'gold' : ''}`}>
          <Icon style={{width: '24px', height: '24px'}} />
        </div>
        <div className="ms-3">
          <p className="text-muted mb-1 text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.14em' }}>{title}</p>
          <p className="h4 mb-0">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;