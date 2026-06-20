'use client';

import React from 'react';
import { SiteDataProvider } from '@/context/SiteDataContext';
import { ShopProvider } from '@/context/ShopContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ settings, children }) {
  return (
    <SiteDataProvider settings={settings}>
      <ShopProvider>
        <AnnouncementBar />
        <Header />
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
      </ShopProvider>
    </SiteDataProvider>
  );
}
