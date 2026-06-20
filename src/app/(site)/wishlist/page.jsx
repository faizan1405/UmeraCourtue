'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ui/ProductCard';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useShop();

  return (
    <div className="container section-padding" style={{ minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>Your Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Heart size={48} style={{ color: 'var(--color-border)', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '15px' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Save your favorite pieces here for later.</p>
          <Link href="/collections" className="btn-primary">Discover Couture</Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
