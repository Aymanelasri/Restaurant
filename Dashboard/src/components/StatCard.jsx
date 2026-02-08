import React from 'react';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="card hover-shadow transition-all">
      <div className="card-body d-flex align-items-center">
        <div className={`rounded-circle d-flex align-items-center justify-content-center text-white p-3 ${color}`} style={{width: '60px', height: '60px'}}>
          <Icon style={{width: '24px', height: '24px'}} />
        </div>
        <div className="ms-3">
          <p className="text-muted mb-1 small">{title}</p>
          <p className="h4 mb-0 fw-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;