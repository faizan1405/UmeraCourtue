import React from 'react';
import { Phone } from 'lucide-react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-text">
        <span>Luxury Couture Pieces</span>
        <span className="separator">|</span>
        <span>Custom Orders Available</span>
      </div>
      <a href="https://wa.me/917774056979" target="_blank" rel="noreferrer" className="announcement-action">
        <Phone size={14} className="icon" />
        <span>WhatsApp to Order</span>
      </a>
    </div>
  );
};

export default AnnouncementBar;
