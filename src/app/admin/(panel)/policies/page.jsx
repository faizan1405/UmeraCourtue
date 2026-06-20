'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Toast from '@/components/admin/Toast';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

const policyTypes = [
  { type: 'privacy', label: 'Privacy Policy' },
  { type: 'terms', label: 'Terms & Conditions' },
  { type: 'shipping', label: 'Shipping & Returns' },
  { type: 'sizeGuide', label: 'Size Guide' },
];

export default function PoliciesEditor() {
  const [policies, setPolicies] = useState({});
  const [activeTab, setActiveTab] = useState('privacy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch('/api/policies').then(r => r.json()).then(data => {
      const mapped = {};
      if (Array.isArray(data)) {
        data.forEach(p => { mapped[p.type] = { title: p.title, content: p.content }; });
      }
      // Set defaults for missing policies
      policyTypes.forEach(pt => {
        if (!mapped[pt.type]) {
          mapped[pt.type] = { title: pt.label, content: '' };
        }
      });
      setPolicies(mapped);
      setLoading(false);
    });
  }, []);

  const updatePolicy = (field, value) => {
    setPolicies(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { type: activeTab, ...policies[activeTab] };
      const res = await fetch('/api/policies', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      setToast({ message: 'Policy saved!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const current = policies[activeTab] || { title: '', content: '' };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Policies</h1>
        <button className="admin-btn success" onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </div>

      <div className="admin-tabs">
        {policyTypes.map(pt => (
          <button key={pt.type} className={`admin-tab ${activeTab === pt.type ? 'active' : ''}`} onClick={() => setActiveTab(pt.type)}>
            {pt.label}
          </button>
        ))}
      </div>

      <div className="admin-form">
        <div className="form-group">
          <label className="field-label">Title</label>
          <input className="admin-input" value={current.title} onChange={(e) => updatePolicy('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="field-label">Content (HTML)</label>
          <textarea className="admin-textarea" value={current.content} onChange={(e) => updatePolicy('content', e.target.value)} style={{ minHeight: '400px', fontFamily: 'monospace', fontSize: '0.85rem' }} />
        </div>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
          You can use HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;table&gt;, &lt;strong&gt; to format content.
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
