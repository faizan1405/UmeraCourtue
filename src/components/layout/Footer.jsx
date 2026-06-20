'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';

const Footer = () => {
  const { settings } = useSiteData();
  const s = settings || {};

  return (
    <footer className="footer section-padding">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <div className="footer-logo" style={{ marginBottom: '1rem' }}>
              <img src="/umera-logo.png" alt="Umera Couture Logo" style={{ height: '60px', width: 'auto' }} />
            </div>
            <p className="footer-desc">
              A celebration of timeless elegance, refined craftsmanship, and modern sophistication.
            </p>
            <div className="social-links">
              {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer" className="social-link">IG</a>}
              <a href="#" className="social-link">FB</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <ul>
              <li>
                <Phone size={16} className="contact-icon" />
                <a href={`tel:+91${s.phone || '7774056979'}`}>+91 {s.phone || '7774056979'}</a>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <a href={`https://wa.me/91${s.whatsapp || '7774056979'}`} target="_blank" rel="noreferrer">WhatsApp: +91 {s.whatsapp || '7774056979'}</a>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <a href={`mailto:${s.email || 'umeracouture@gmail.com'}`}>{s.email || 'umeracouture@gmail.com'}</a>
              </li>
              <li className="address">
                <MapPin size={16} className="contact-icon map-icon" />
                <span>{s.address || '402, 5th Floor, Charyana Heights, Beside Italian Bakery, Raikhad, Ahmedabad, Gujarat - 380001'}</span>
              </li>
            </ul>
          </div>
          
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Umera Couture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
