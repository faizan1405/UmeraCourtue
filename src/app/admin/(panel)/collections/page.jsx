'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';

export default function CollectionsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', bannerImage: '', sortOrder: 0, isVisible: true });

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', bannerImage: '', sortOrder: 0, isVisible: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', bannerImage: cat.bannerImage || '', sortOrder: cat.sortOrder || 0, isVisible: cat.isVisible });
    setEditing(cat._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const autoSlug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const body = { ...form, slug: form.slug || autoSlug };

    try {
      if (editing) {
        await fetch(`/api/categories/${editing}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        setToast({ message: 'Collection updated', type: 'success' });
      } else {
        await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        setToast({ message: 'Collection created', type: 'success' });
      }
      resetForm();
      fetchCategories();
    } catch {
      setToast({ message: 'Failed to save', type: 'error' });
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/categories/${deleteId}`, { method: 'DELETE' });
    setCategories(prev => prev.filter(c => c._id !== deleteId));
    setDeleteId(null);
    setToast({ message: 'Collection deleted', type: 'success' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Collections</h1>
        <button className="admin-btn gold" onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} /> Add Collection</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem' }}>{editing ? 'Edit Collection' : 'New Collection'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="field-label">Name *</label>
              <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="field-label">Slug</label>
              <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from name" />
            </div>
            <div className="form-group full-width">
              <label className="field-label">Description</label>
              <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: '80px' }} />
            </div>
            <div className="form-group">
              <label className="field-label">Sort Order</label>
              <input className="admin-input" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '24px' }}>
              <button type="button" className={`toggle-switch ${form.isVisible ? 'active' : ''}`} onClick={() => setForm({ ...form, isVisible: !form.isVisible })} />
              <span style={{ fontSize: '0.9rem' }}>Visible</span>
            </div>
          </div>
          <ImageUploader images={form.bannerImage ? [form.bannerImage] : []} onImagesChange={(imgs) => setForm({ ...form, bannerImage: imgs[0] || '' })} multiple={false} label="Banner Image" />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="admin-btn secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="admin-btn success">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Visible</th><th>Sort</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td>{c.bannerImage ? <img src={c.bannerImage} className="table-thumb" alt={c.name} /> : '—'}</td>
                <td><strong>{c.name}</strong></td>
                <td style={{ color: '#888' }}>{c.slug}</td>
                <td><span className={`badge ${c.isVisible ? 'visible' : 'hidden'}`}>{c.isVisible ? 'Visible' : 'Hidden'}</span></td>
                <td>{c.sortOrder}</td>
                <td>
                  <div className="table-actions">
                    <button className="table-btn edit" onClick={() => handleEdit(c)}><Edit size={14} /> Edit</button>
                    <button className="table-btn delete" onClick={() => setDeleteId(c._id)}><Trash2 size={14} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan={6} className="admin-empty"><p>No collections yet.</p></td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Delete Collection" message="Delete this collection?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
