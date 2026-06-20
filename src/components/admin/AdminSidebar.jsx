'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Package, FolderOpen, Home, Phone, FileText,
  MessageSquare, LogOut, Menu, X, ChevronRight, ShoppingCart
} from 'lucide-react';
import './AdminLayout.css';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/contact', label: 'Contact', icon: Phone },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/policies', label: 'Policies', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <>
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(true)}>
        <Menu size={24} />
      </button>

      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-logo" style={{ gap: '10px' }}>
            <img src="/umera-logo.png" alt="Umera Couture Logo" style={{ height: '40px', width: 'auto' }} />
            <span className="admin-logo-sub">Admin</span>
          </Link>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive(item) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {isActive(item) && <ChevronRight size={14} className="nav-arrow" />}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item view-site" target="_blank">
            <Home size={18} />
            <span>View Website</span>
          </Link>
          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
