'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import Toast from '@/components/admin/Toast';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/admin/enquiries').then(r => r.json()).then(data => {
      setEnquiries(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/admin/enquiries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
      setToast({ message: 'Status updated', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update', type: 'error' });
    }
  };

  const filtered = filter ? enquiries.filter(e => e.status === filter) : enquiries;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Enquiries</h1>
      </div>

      <div className="admin-filter-bar">
        <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span style={{ fontSize: '0.85rem', color: '#888' }}>{filtered.length} enquiries</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e._id}>
                <td>{new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td><strong>{e.customerName || '—'}</strong></td>
                <td>{e.phone ? <a href={`tel:${e.phone}`}>{e.phone}</a> : '—'}</td>
                <td>
                  {e.items?.map((item, i) => {
                    const specs = [
                      item.size ? `Size: ${item.size}` : '',
                      item.color ? `Color: ${item.color}` : ''
                    ].filter(Boolean).join(', ');
                    return (
                      <div key={i} style={{ fontSize: '0.85rem', marginBottom: '2px' }}>
                        {item.productName} {specs ? `(${specs})` : ''} × {item.quantity || 1}
                      </div>
                    );
                  }) || '—'}
                </td>
                <td><span className={`badge status-${e.status}`}>{e.status}</span></td>
                <td>
                  <select
                    className="status-select"
                    value={e.status}
                    onChange={(ev) => updateStatus(e._id, ev.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="admin-empty"><p>No enquiries found.</p></td></tr>}
          </tbody>
        </table>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
