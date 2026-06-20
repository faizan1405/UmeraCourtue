'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

export default function HomeClient({ products, newArrivals, categories, settings }) {
  const s = settings || {};
  const whatsappUrl = `https://wa.me/91${s.whatsapp || '7774056979'}?text=${encodeURIComponent("Hi Umera Couture, I'm interested in a custom order.")}`;

  const displayProducts = newArrivals.length > 0 ? newArrivals : products;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img src={s.heroBanner || '/hero_banner.png'} alt="Umera Couture Luxury Fashion" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content fade-in-up">
          <h1>{s.heroHeading || 'Modern Elegance'}</h1>
          <p>{s.heroSubtitle || 'Discover the new era of luxury couture pieces crafted for the sophisticated.'}</p>
          <div className="hero-actions">
            <Link href={s.heroButton1Link || '/collections'} className="btn-primary">
              {s.heroButton1Text || 'Shop Collection'}
            </Link>
            <a href={s.heroButton2Link || whatsappUrl} target={s.heroButton2Link ? '_self' : '_blank'} rel="noreferrer" className="btn-outline">
              {s.heroButton2Text || 'Book Custom Order'}
            </a>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-padding container">
        <div className="section-header text-center margin-bottom-lg">
          <h2>{s.featuredHeading || 'Curated Collections'}</h2>
          <p>{s.featuredSubtitle || 'Explore our exclusive ranges of high-end fashion'}</p>
        </div>
        
        <div className="collections-grid">
          {categories.slice(0, 3).map(cat => (
            <Link key={cat._id} href={`/collections/${cat.slug}`} className="collection-card">
              <div className="collection-image">
                <img src={cat.bannerImage || '/product_1.png'} alt={cat.name} />
              </div>
              <div className="collection-info">
                <h3>{cat.name}</h3>
                <span>Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals (Product Grid) */}
      {displayProducts.length > 0 && (
        <section className="section-padding container bg-soft">
          <div className="section-header text-center margin-bottom-lg">
            <h2>New Arrivals</h2>
            <p>The latest additions to our luxury lineup</p>
          </div>
          
          <div className="products-grid">
            {displayProducts.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link href="/collections" className="btn-outline">View All Pieces</Link>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="about-content text-center">
            <h2>{s.aboutHeading || 'The Umera Story'}</h2>
            <p className="about-text">
              {s.aboutText || '"Umera Couture is a celebration of timeless elegance, refined craftsmanship, and modern sophistication."'}
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section section-padding container text-center">
        <h2>Join Our World</h2>
        <p className="margin-bottom-lg">Subscribe for the latest updates, new launches, and exclusive access.</p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Your email address" required />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </section>
    </div>
  );
}
