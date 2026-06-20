'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Toast from '@/components/admin/Toast';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function ContactEditor() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => { setSettings(data); setLoading(false); });
  }, []);

  const updateField = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      if (!res.ok) throw new Error('Save failed');
      setToast({ message: 'Contact details saved!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Contact Details</h1>
        <button className="admin-btn success" onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </div>

      <div className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="field-label">Phone Number</label>
            <input className="admin-input" value={settings?.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">WhatsApp Number</label>
            <input className="admin-input" value={settings?.whatsapp || ''} onChange={(e) => updateField('whatsapp', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Email</label>
            <input className="admin-input" type="email" value={settings?.email || ''} onChange={(e) => updateField('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Instagram URL</label>
            <input className="admin-input" value={settings?.instagram || ''} onChange={(e) => updateField('instagram', e.target.value)} placeholder="https://instagram.com/umeracouture" />
          </div>
          <div className="form-group full-width">
            <label className="field-label">Address</label>
            <textarea className="admin-textarea" value={settings?.address || ''} onChange={(e) => updateField('address', e.target.value)} style={{ minHeight: '80px' }} />
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
