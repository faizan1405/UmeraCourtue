'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast from '@/components/admin/Toast';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch('/api/products?all=true');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    try {
      await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== deleteId));
      setToast({ message: 'Product deleted', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
    setDeleteId(null);
  };

  const toggleVisibility = async (id, current) => {
    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !current }),
    });
    setProducts(prev => prev.map(p => p._id === id ? { ...p, isVisible: !current } : p));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="admin-btn gold"><Plus size={16} /> Add Product</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Tags</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><img src={p.images?.[0] || '/product_1.png'} alt={p.name} className="table-thumb" /></td>
                <td><strong>{p.name}</strong></td>
                <td>{p.category || '—'}</td>
                <td>
                  {p.priceOnRequest || !p.price ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.85rem' }}>On Request</span>
                      <span style={{ color: '#d32f2f', fontSize: '0.75rem', fontWeight: '600' }}>⚠️ Price must be added before sale</span>
                    </div>
                  ) : (
                    p.price
                  )}
                </td>
                <td>
                  {p.isFeatured && <span className="badge featured">Featured</span>}{' '}
                  {p.isNewArrival && <span className="badge new-arrival">New</span>}{' '}
                  {p.isBestSeller && <span className="badge best-seller">Best</span>}
                </td>
                <td>
                  <button className={`toggle-switch ${p.isVisible ? 'active' : ''}`} onClick={() => toggleVisibility(p._id, p.isVisible)} />
                </td>
                <td>
                  <div className="table-actions">
                    <Link href={`/admin/products/edit/${p._id}`} className="table-btn edit"><Edit size={14} /> Edit</Link>
                    <button className="table-btn delete" onClick={() => setDeleteId(p._id)}><Trash2 size={14} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="admin-empty"><p>No products found.</p><Link href="/admin/products/new" className="admin-btn gold">Add your first product</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
