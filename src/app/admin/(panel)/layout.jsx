'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function AdminPanelLayout({ children }) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
