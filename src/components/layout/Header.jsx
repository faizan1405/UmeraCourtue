import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, wishlist, isSearchOpen, setIsSearchOpen } = useShop();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

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
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/collections" onClick={() => setMobileMenuOpen(false)}>Collections</Link></li>
            <li><Link to="/collections" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
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
          <button className="icon-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={20} />
          </button>
          <Link to="/wishlist" className="icon-btn cart-btn">
            <Heart size={20} />
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <a href="https://wa.me/917774056979" target="_blank" rel="noreferrer" className="whatsapp-btn-header">
            <Phone size={16} /> Contact
          </a>
        </div>
        
      </div>

      {/* Search Overlay Placeholder */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-container">
            <input type="text" placeholder="Search for products..." autoFocus />
            <button onClick={() => setIsSearchOpen(false)}><X size={24} /></button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
