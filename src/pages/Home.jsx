import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import './Home.css';

const Home = () => {
  // Dummy data for products
  const products = [
    {
      id: 1,
      name: 'The Ivory Gown',
      price: 'Price on Request',
      image: '/product_1.png',
      sizes: ['XS', 'S', 'M', 'L', 'Custom'],
    },
    {
      id: 2,
      name: 'Champagne Elegance',
      price: 'Price on Request',
      image: '/product_2.png',
      sizes: ['S', 'M', 'L', 'Custom'],
    },
    {
      id: 3,
      name: 'Midnight Noir Dress',
      price: 'Price on Request',
      image: '/product_1.png',
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      id: 4,
      name: 'Blush Dream Couture',
      price: 'Price on Request',
      image: '/product_2.png',
      sizes: ['Custom Only'],
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/hero_banner.png" alt="Umera Couture Luxury Fashion" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content fade-in-up">
          <h1>Modern Elegance</h1>
          <p>Discover the new era of luxury couture pieces crafted for the sophisticated.</p>
          <div className="hero-actions">
            <Link to="/collections" className="btn-primary">Shop Collection</Link>
            <a href="https://wa.me/917774056979?text=Hi%20Umera%20Couture,%20I'm%20interested%20in%20a%20custom%20order." target="_blank" rel="noreferrer" className="btn-outline">Book Custom Order</a>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-padding container">
        <div className="section-header text-center margin-bottom-lg">
          <h2>Curated Collections</h2>
          <p>Explore our exclusive ranges of high-end fashion</p>
        </div>
        
        <div className="collections-grid">
          <Link to="/collection/festive" className="collection-card">
            <div className="collection-image">
              <img src="/product_1.png" alt="Festive Wear" />
            </div>
            <div className="collection-info">
              <h3>Festive Wear</h3>
              <span>Explore</span>
            </div>
          </Link>
          <Link to="/collection/casual" className="collection-card">
            <div className="collection-image">
              <img src="/product_2.png" alt="Casual Elegance" />
            </div>
            <div className="collection-info">
              <h3>Casual Elegance</h3>
              <span>Explore</span>
            </div>
          </Link>
          <Link to="/collection/formal" className="collection-card">
            <div className="collection-image">
              <img src="/product_1.png" alt="Formal Wear" />
            </div>
            <div className="collection-info">
              <h3>Formal Wear</h3>
              <span>Explore</span>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals (Product Grid) */}
      <section className="section-padding container bg-soft">
        <div className="section-header text-center margin-bottom-lg">
          <h2>New Arrivals</h2>
          <p>The latest additions to our luxury lineup</p>
        </div>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center" style={{ marginTop: '3rem' }}>
          <Link to="/collections" className="btn-outline">View All Pieces</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="about-content text-center">
            <h2>The Umera Story</h2>
            <p className="about-text">
              “Umera Couture is a celebration of timeless elegance, refined craftsmanship, and modern sophistication. We create thoughtfully designed pieces that blend luxury with individuality, ensuring every outfit tells a story of confidence, grace, and style.”
            </p>
          </div>
        </div>
      </section>

      {/* Instagram / Newsletter */}
      <section className="newsletter-section section-padding container text-center">
        <h2>Join Our World</h2>
        <p className="margin-bottom-lg">Subscribe for the latest updates, new launches, and exclusive access.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Your email address" required />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </section>

    </div>
  );
};

export default Home;
