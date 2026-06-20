'use client';

import React, { Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';

function CollectionsContent({ products = [], categories = [], initialCategory }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get active category slug from pathname (e.g. /collections/festive-wear -> festive-wear)
  const segments = pathname.split('/').filter(Boolean);
  const pathCategory = (segments[0] === 'collections' && segments[1]) ? segments[1] : 'all';
  
  // Fallback to initialCategory if pathname is generic /collections
  const activeCategory = pathCategory !== 'all' ? pathCategory : (initialCategory || 'all');

  const searchQuery = searchParams.get('search') || '';

  // Filter products by activeCategory and searchQuery
  const filtered = products.filter(product => {
    // 1. Category Filter
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

    // 2. Search Filter
    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = product.name?.toLowerCase().includes(query) || false;
      const categoryMatch = product.category?.toLowerCase().includes(query) || false;
      const descMatch = (
        product.shortDescription?.toLowerCase().includes(query) || 
        product.fullDescription?.toLowerCase().includes(query) ||
        false
      );
      
      const tagsMatch = Array.isArray(product.tags) 
        ? product.tags.some(tag => tag.toLowerCase().includes(query))
        : typeof product.tags === 'string' ? product.tags.toLowerCase().includes(query) : false;
        
      const colorsMatch = Array.isArray(product.colors)
        ? product.colors.some(c => c.toLowerCase().includes(query))
        : typeof product.colors === 'string' ? product.colors.toLowerCase().includes(query) : false;

      const fabricMatch = product.fabricDetails?.toLowerCase().includes(query) || false;

      matchesSearch = nameMatch || categoryMatch || descMatch || tagsMatch || colorsMatch || fabricMatch;
    }

    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (slug) => {
    const params = new URLSearchParams(searchParams.toString());
    const search = params.get('search');
    
    let targetPath = '/collections';
    if (slug !== 'all') {
      targetPath = `/collections/${slug}`;
    }
    
    if (search) {
      router.push(`${targetPath}?search=${encodeURIComponent(search)}`);
    } else {
      router.push(targetPath);
    }
  };

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
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`btn-outline ${activeCategory === cat.slug ? 'btn-primary' : ''}`}
              style={{ padding: '8px 20px', fontSize: '0.8rem' }}
              onClick={() => handleCategoryChange(cat.slug)}
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

export default function CollectionsClient(props) {
  return (
    <Suspense fallback={<div className="container section-padding text-center">Loading collections...</div>}>
      <CollectionsContent {...props} />
    </Suspense>
  );
}

