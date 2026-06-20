import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer section-padding">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h3 className="footer-logo">Umera Couture</h3>
            <p className="footer-desc">
              A celebration of timeless elegance, refined craftsmanship, and modern sophistication.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">IG</a>
              <a href="#" className="social-link">FB</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <ul>
              <li>
                <Phone size={16} className="contact-icon" />
                <a href="tel:7774056979">+91 7774056979</a>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <a href="https://wa.me/917774056979" target="_blank" rel="noreferrer">WhatsApp: +91 7774056979</a>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <a href="mailto:umeracouture@gmail.com">umeracouture@gmail.com</a>
              </li>
              <li className="address">
                <MapPin size={16} className="contact-icon map-icon" />
                <span>402, 5th Floor, Charyana Heights, Beside Italian Bakery, Raikhad, Ahmedabad, Gujarat - 380001</span>
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
