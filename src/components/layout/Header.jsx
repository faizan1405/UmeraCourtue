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


  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

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
        
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>

        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <img src="/umera-logo.png" alt="Umera Couture Logo" style={{ height: '60px', width: 'auto' }} />
            <button className="close-menu" onClick={() => setMobileMenuOpen(false)}>
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

        {mobileMenuOpen && (
          <div className="nav-overlay" onClick={() => setMobileMenuOpen(false)}></div>
        )}

        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/umera-logo.png" alt="Umera Couture Logo" style={{ height: '80px', width: 'auto' }} />
        </Link>

        <div className="header-icons">
          <button className="icon-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={20} />
          </button>
          <Link href="/wishlist" className="icon-btn cart-btn">
            <Heart size={20} />
            {mounted && wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className="icon-btn cart-btn">
            <ShoppingBag size={20} />
            {mounted && cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-btn-header">
            <Phone size={16} /> Contact
          </a>
        </div>
        
      </div>

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
            <button type="submit" style={{ marginRight: '15px' }} aria-label="Search">
              <Search size={24} />
            </button>
            <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} aria-label="Close search">
              <X size={24} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
