'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import Toast from '@/components/admin/Toast';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function HomepageEditor() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const updateField = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Save failed');
      setToast({ message: 'Homepage settings saved!', type: 'success' });
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
        <h1>Edit Homepage</h1>
        <button className="admin-btn success" onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </div>

      <div className="admin-form">
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>Hero Section</h2>
        <div className="form-grid">
          <div className="form-group full-width">
            <label className="field-label">Hero Heading</label>
            <input className="admin-input" value={settings?.heroHeading || ''} onChange={(e) => updateField('heroHeading', e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label className="field-label">Hero Subtitle</label>
            <textarea className="admin-textarea" value={settings?.heroSubtitle || ''} onChange={(e) => updateField('heroSubtitle', e.target.value)} style={{ minHeight: '80px' }} />
          </div>
          <div className="form-group">
            <label className="field-label">Button 1 Text</label>
            <input className="admin-input" value={settings?.heroButton1Text || ''} onChange={(e) => updateField('heroButton1Text', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Button 1 Link</label>
            <input className="admin-input" value={settings?.heroButton1Link || ''} onChange={(e) => updateField('heroButton1Link', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Button 2 Text</label>
            <input className="admin-input" value={settings?.heroButton2Text || ''} onChange={(e) => updateField('heroButton2Text', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Button 2 Link</label>
            <input className="admin-input" value={settings?.heroButton2Link || ''} onChange={(e) => updateField('heroButton2Link', e.target.value)} />
          </div>
        </div>
        <ImageUploader images={settings?.heroBanner ? [settings.heroBanner] : []} onImagesChange={(imgs) => updateField('heroBanner', imgs[0] || '')} multiple={false} label="Hero Banner Image" />

        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>Featured Section</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="field-label">Section Heading</label>
            <input className="admin-input" value={settings?.featuredHeading || ''} onChange={(e) => updateField('featuredHeading', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Section Subtitle</label>
            <input className="admin-input" value={settings?.featuredSubtitle || ''} onChange={(e) => updateField('featuredSubtitle', e.target.value)} />
          </div>
        </div>

        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>About Section</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="field-label">Section Heading</label>
            <input className="admin-input" value={settings?.aboutHeading || ''} onChange={(e) => updateField('aboutHeading', e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label className="field-label">About Text</label>
            <textarea className="admin-textarea" value={settings?.aboutText || ''} onChange={(e) => updateField('aboutText', e.target.value)} />
          </div>
        </div>

        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>Announcement Bar</h2>
        <div className="form-group">
          <label className="field-label">Announcement Text (use | to separate)</label>
          <input className="admin-input" value={settings?.announcementText || ''} onChange={(e) => updateField('announcementText', e.target.value)} />
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
