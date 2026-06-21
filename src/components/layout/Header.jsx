'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useSiteData } from '@/context/SiteDataContext';

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, wishlist, isSearchOpen, setIsSearchOpen, mounted } = useShop();
  const { settings } = useSiteData();

  const [animateCart, setAnimateCart] = useState(false);
  const [animateWishlist, setAnimateWishlist] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const t = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  useEffect(() => {
    if (wishlistCount > 0) {
      setAnimateWishlist(true);
      const t = setTimeout(() => setAnimateWishlist(false), 300);
      return () => clearTimeout(t);
    }
  }, [wishlistCount]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
    const query = searchQuery.trim();
    setSearchQuery('');
    if (query) {
      router.push(`/collections?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/collections');
    }
  };

  const whatsappUrl = settings?.whatsapp
    ? `https://wa.me/91${settings.whatsapp}`
    : 'https://wa.me/917774056979';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        
        {/* LEFT COLUMN: Menu/Nav */}
        <div className="header-left">
          <button className="mobile-toggle btn-click-feedback" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav-header">
              <img src="/umera-logo.png" alt="Umera Couture Logo" style={{ height: '50px', width: 'auto' }} />
              <button className="close-menu btn-click-feedback" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <ul className="nav-list">
              <li><Link href="/" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>Home</Link></li>
              <li><Link href="/collections" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>Collections</Link></li>
              <li><Link href="/new-arrivals" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>New Arrivals</Link></li>
              <li><Link href="/about" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>About</Link></li>
              <li><Link href="/contact" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>Contact</Link></li>
            </ul>
          </nav>
        </div>

        {/* CENTER COLUMN: Logo */}
        <div className="header-center">
          <Link href="/" className="logo-container" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>
            <img src="/umera-logo.png" alt="Umera Couture Logo" className="logo-img" />
          </Link>
        </div>

        {/* RIGHT COLUMN: Actions */}
        <div className="header-right">
          <button className="icon-btn btn-click-feedback" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={22} />
          </button>
          <Link href="/wishlist" className="icon-btn cart-btn btn-click-feedback">
            <Heart size={22} />
            {mounted && wishlistCount > 0 && (
              <span className={`cart-count ${animateWishlist ? 'badge-pop' : ''}`}>{wishlistCount}</span>
            )}
          </Link>
          <Link href="/cart" className="icon-btn cart-btn btn-click-feedback">
            <ShoppingBag size={22} />
            {mounted && cartCount > 0 && (
              <span className={`cart-count ${animateCart ? 'badge-pop' : ''}`}>{cartCount}</span>
            )}
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-btn-header btn-click-feedback">
            <Phone size={18} className="whatsapp-icon" />
            <span className="whatsapp-text">Contact</span>
          </a>
        </div>
        
      </div>

      <div className={`nav-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

      {isSearchOpen && (
        <div className="search-overlay">
          <form onSubmit={handleSearchSubmit} className="search-container">
            <input 
              type="text" 
              placeholder="Search for products..." 
              autoFocus 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-click-feedback" style={{ marginRight: '15px' }} aria-label="Search">
              <Search size={24} />
            </button>
            <button type="button" className="btn-click-feedback" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} aria-label="Close search">
              <X size={24} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
