import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className={`modal-dialog modal-dialog-centered modal-${size}`}>
        <div className="modal-content" style={{ borderTop: '3px solid var(--red)' }}>
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn btn-link text-muted p-0"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon style={{width: '22px', height: '22px'}} />
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;