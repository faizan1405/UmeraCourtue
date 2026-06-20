'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, FolderOpen, MessageSquare, AlertCircle, Plus, Settings, Home, FileText, ShoppingCart, TrendingUp, Eye } from 'lucide-react';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, categoriesRes, enquiriesRes, ordersRes] = await Promise.all([
          fetch('/api/products?all=true'),
          fetch('/api/categories'),
          fetch('/api/admin/enquiries'),
          fetch('/api/admin/orders'),
        ]);
        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const enquiries = enquiriesRes.ok ? await enquiriesRes.json() : [];
        const orders = ordersRes.ok ? await ordersRes.json() : [];

        let totalRevenue = 0;
        orders.forEach(order => {
          if (order.paymentStatus === 'paid') {
            const cleaned = parseFloat(order.totalAmount?.toString().replace(/[^\d.]/g, ''));
            if (!isNaN(cleaned)) {
              totalRevenue += cleaned;
            }
          }
        });

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          enquiries: Array.isArray(enquiries) ? enquiries.length : 0,
          pendingEnquiries: Array.isArray(enquiries) ? enquiries.filter(e => e.status === 'new').length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          pendingOrders: Array.isArray(orders) ? orders.filter(o => o.orderStatus === 'pending').length : 0,
          revenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        });

        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
      } catch {
        setStats({ products: 0, categories: 0, enquiries: 0, pendingEnquiries: 0, orders: 0, pendingOrders: 0, revenue: '₹0' });
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

      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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
            <h3>{stats?.pendingEnquiries || 0}</h3>
            <p>Pending Enquiries</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon enquiries" style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}><ShoppingCart size={24} /></div>
          <div className="stat-info">
            <h3>{stats?.orders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon pending" style={{ backgroundColor: '#fce4ec', color: '#c62828' }}><AlertCircle size={24} /></div>
          <div className="stat-info">
            <h3>{stats?.pendingOrders || 0}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon pending" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>{stats?.revenue || '₹0'}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a2e' }}>Quick Actions</h2>
      <div className="admin-quick-actions">
        <Link href="/admin/products/new" className="quick-action-link"><Plus size={18} /> Add Product</Link>
        <Link href="/admin/products" className="quick-action-link"><Package size={18} /> Manage Products</Link>
        <Link href="/admin/collections" className="quick-action-link"><FolderOpen size={18} /> Manage Collections</Link>
        <Link href="/admin/orders" className="quick-action-link"><ShoppingCart size={18} /> Manage Orders</Link>
        <Link href="/admin/homepage" className="quick-action-link"><Home size={18} /> Edit Homepage</Link>
        <Link href="/admin/contact" className="quick-action-link"><Settings size={18} /> Edit Contact</Link>
        <Link href="/admin/enquiries" className="quick-action-link"><MessageSquare size={18} /> View Enquiries</Link>
        <Link href="/admin/policies" className="quick-action-link"><FileText size={18} /> Edit Policies</Link>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a2e' }}>Recent Orders</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td><strong>#{order._id.substring(order._id.length - 8)}</strong></td>
                  <td>{order.customerName}</td>
                  <td>{order.totalAmount}</td>
                  <td><span className={`badge status-${order.orderStatus}`}>{order.orderStatus}</span></td>
                  <td><span className={`badge status-${order.paymentStatus}`}>{order.paymentStatus}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td>
                    <Link href={`/admin/orders?view=${order._id}`} className="table-btn edit">
                      <Eye size={12} /> View
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty" style={{ textAlign: 'center', padding: '30px' }}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
