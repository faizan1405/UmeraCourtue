import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Phone } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        
        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>

        {/* Navigation */}
        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <span className="logo-text">Umera</span>
            <button className="close-menu" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <ul className="nav-list">
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/custom-order">Custom Couture</Link></li>
            <li><Link to="/about">Our Story</Link></li>
          </ul>
        </nav>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div className="nav-overlay" onClick={() => setMobileMenuOpen(false)}></div>
        )}

        {/* Logo */}
        <Link to="/" className="logo">
          Umera Couture
        </Link>

        {/* Icons */}
        <div className="header-icons">
          <button className="icon-btn"><Search size={20} /></button>
          <button className="icon-btn"><Heart size={20} /></button>
          <button className="icon-btn cart-btn">
            <ShoppingBag size={20} />
            <span className="cart-count">0</span>
          </button>
          <a href="https://wa.me/917774056979" target="_blank" rel="noreferrer" className="whatsapp-btn-header">
            <Phone size={16} /> Contact
          </a>
        </div>
        
      </div>
    </header>
  );
};

export default Header;
