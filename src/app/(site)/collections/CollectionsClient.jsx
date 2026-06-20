'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';

export default function CollectionsClient({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="container section-padding">
      <div className="section-header text-center margin-bottom-lg fade-in-up">
        <h1>All Collections</h1>
        <p>Explore our full range of luxury couture pieces.</p>
      </div>

      {categories.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-outline ${activeCategory === 'all' ? 'btn-primary' : ''}`}
            style={{ padding: '8px 20px', fontSize: '0.8rem' }}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`btn-outline ${activeCategory === cat.slug ? 'btn-primary' : ''}`}
              style={{ padding: '8px 20px', fontSize: '0.8rem' }}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      
      <div className="products-grid fade-in-up" style={{ animationDelay: '0.2s' }}>
        {filtered.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center" style={{ padding: '3rem 0', color: 'var(--color-text-muted)' }}>
          <p>No products found in this collection.</p>
        </div>
      )}
    </div>
  );
}
