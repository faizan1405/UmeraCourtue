'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, X } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import Toast from '@/components/admin/Toast';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function ProductForm({ productId }) {
  const router = useRouter();
  const isEdit = !!productId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  const [form, setForm] = useState({
    name: '', slug: '', category: '', price: '', priceOnRequest: true,
    shortDescription: '', fullDescription: '', fabricDetails: '',
    sizes: [], colors: [], careInstructions: '', stockStatus: 'in_stock',
    images: [], whatsappMessage: '',
    isFeatured: false, isNewArrival: false, isBestSeller: false, isVisible: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []));
    if (isEdit) {
      fetch(`/api/products/${productId}`).then(r => r.json()).then(data => {
        if (data && !data.error) setForm(data);
        setLoading(false);
      });
    }
  }, [isEdit, productId]);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const addChip = (field, value, setter) => {
    if (value.trim() && !form[field].includes(value.trim())) {
      updateField(field, [...form[field], value.trim()]);
    }
    setter('');
  };

  const removeChip = (field, index) => {
    updateField(field, form[field].filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setToast({ message: 'Product name is required', type: 'error' }); return; }
    if (form.images.length === 0) { setToast({ message: 'At least one image is required', type: 'error' }); return; }

    setSaving(true);
    try {
      const url = isEdit ? `/api/products/${productId}` : '/api/products';
      const method = isEdit ? 'PATCH' : 'POST';
      const body = { ...form };
      if (!isEdit && !body.slug) body.slug = autoSlug(body.name);

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setToast({ message: isEdit ? 'Product updated!' : 'Product created!', type: 'success' });
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <button className="admin-btn secondary" onClick={() => router.push('/admin/products')}><ArrowLeft size={16} /> Back</button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="field-label">Product Name *</label>
            <input className="admin-input" value={form.name} onChange={(e) => { updateField('name', e.target.value); if (!isEdit) updateField('slug', autoSlug(e.target.value)); }} required />
          </div>
          <div className="form-group">
            <label className="field-label">Slug</label>
            <input className="admin-input" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Category</label>
            <select className="admin-select" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="field-label">Stock Status</label>
            <select className="admin-select" value={form.stockStatus} onChange={(e) => updateField('stockStatus', e.target.value)}>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="made_to_order">Made to Order</option>
            </select>
          </div>
          <div className="form-group">
            <label className="field-label">Price</label>
            <input className="admin-input" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="₹5,999 or leave empty" />
            {(!form.price || form.priceOnRequest) && (
              <p style={{ color: '#d32f2f', fontSize: '0.82rem', marginTop: '6px', lineHeight: '1.4' }}>
                ⚠️ Price details missing or Price on Request enabled. This product will be marked as &quot;Unavailable for Online Purchase&quot; on the storefront.
              </p>
            )}
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '24px' }}>
            <button type="button" className={`toggle-switch ${form.priceOnRequest ? 'active' : ''}`} onClick={() => updateField('priceOnRequest', !form.priceOnRequest)} />
            <span style={{ fontSize: '0.9rem' }}>Price on Request</span>
          </div>
          <div className="form-group full-width">
            <label className="field-label">Short Description</label>
            <input className="admin-input" value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label className="field-label">Full Description</label>
            <textarea className="admin-textarea" value={form.fullDescription} onChange={(e) => updateField('fullDescription', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Fabric Details</label>
            <input className="admin-input" value={form.fabricDetails} onChange={(e) => updateField('fabricDetails', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Care Instructions</label>
            <input className="admin-input" value={form.careInstructions} onChange={(e) => updateField('careInstructions', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="field-label">Sizes</label>
            <div className="chip-input-wrap">
              {form.sizes.map((s, i) => <span key={i} className="chip">{s} <button type="button" onClick={() => removeChip('sizes', i)}><X size={12} /></button></span>)}
              <input className="chip-input" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('sizes', sizeInput, setSizeInput); }}} placeholder="Type & press Enter" />
            </div>
          </div>
          <div className="form-group">
            <label className="field-label">Colors</label>
            <div className="chip-input-wrap">
              {form.colors.map((c, i) => <span key={i} className="chip">{c} <button type="button" onClick={() => removeChip('colors', i)}><X size={12} /></button></span>)}
              <input className="chip-input" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('colors', colorInput, setColorInput); }}} placeholder="Type & press Enter" />
            </div>
          </div>
          <div className="form-group">
            <label className="field-label">Sort Order</label>
            <input className="admin-input" type="number" value={form.sortOrder} onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)} />
          </div>
          <div className="form-group">
            <label className="field-label">WhatsApp Message</label>
            <input className="admin-input" value={form.whatsappMessage} onChange={(e) => updateField('whatsappMessage', e.target.value)} placeholder="Custom enquiry message" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
          {[['isFeatured', 'Featured'], ['isNewArrival', 'New Arrival'], ['isBestSeller', 'Best Seller'], ['isVisible', 'Visible']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" className={`toggle-switch ${form[key] ? 'active' : ''}`} onClick={() => updateField(key, !form[key])} />
              <span style={{ fontSize: '0.9rem' }}>{label}</span>
            </div>
          ))}
        </div>

        <ImageUploader images={form.images} onImagesChange={(imgs) => updateField('images', imgs)} label="Product Images *" />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button type="button" className="admin-btn secondary" onClick={() => router.push('/admin/products')}>Cancel</button>
          <button type="submit" className="admin-btn success" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}</button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
