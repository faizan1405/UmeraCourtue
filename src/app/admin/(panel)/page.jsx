'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, FolderOpen, MessageSquare, AlertCircle, Plus, Settings, Home, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, categoriesRes, enquiriesRes] = await Promise.all([
          fetch('/api/products?all=true'),
          fetch('/api/categories'),
          fetch('/api/admin/enquiries'),
        ]);
        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const enquiries = enquiriesRes.ok ? await enquiriesRes.json() : [];

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          enquiries: Array.isArray(enquiries) ? enquiries.length : 0,
          pending: Array.isArray(enquiries) ? enquiries.filter(e => e.status === 'new').length : 0,
        });
      } catch {
        setStats({ products: 0, categories: 0, enquiries: 0, pending: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon products"><Package size={24} /></div>
          <div className="stat-info">
            <h3>{stats?.products || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon categories"><FolderOpen size={24} /></div>
          <div className="stat-info">
            <h3>{stats?.categories || 0}</h3>
            <p>Collections</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon enquiries"><MessageSquare size={24} /></div>
          <div className="stat-info">
            <h3>{stats?.enquiries || 0}</h3>
            <p>Total Enquiries</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon pending"><AlertCircle size={24} /></div>
          <div className="stat-info">
            <h3>{stats?.pending || 0}</h3>
            <p>Pending Enquiries</p>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a2e' }}>Quick Actions</h2>
      <div className="admin-quick-actions">
        <Link href="/admin/products/new" className="quick-action-link"><Plus size={18} /> Add Product</Link>
        <Link href="/admin/products" className="quick-action-link"><Package size={18} /> Manage Products</Link>
        <Link href="/admin/collections" className="quick-action-link"><FolderOpen size={18} /> Manage Collections</Link>
        <Link href="/admin/homepage" className="quick-action-link"><Home size={18} /> Edit Homepage</Link>
        <Link href="/admin/contact" className="quick-action-link"><Settings size={18} /> Edit Contact</Link>
        <Link href="/admin/enquiries" className="quick-action-link"><MessageSquare size={18} /> View Enquiries</Link>
        <Link href="/admin/policies" className="quick-action-link"><FileText size={18} /> Edit Policies</Link>
      </div>
    </div>
  );
}
