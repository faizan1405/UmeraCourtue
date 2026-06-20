'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <AlertTriangle size={32} />
        </div>
        <h3 className="modal-title">{title || 'Confirm Action'}</h3>
        <p className="modal-message">{message || 'Are you sure you want to proceed?'}</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
