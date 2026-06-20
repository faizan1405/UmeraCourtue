'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';

const AnnouncementBar = () => {
  const { settings } = useSiteData();
  const s = settings || {};
  const whatsappUrl = `https://wa.me/91${s.whatsapp || '7774056979'}`;
  const announcementParts = (s.announcementText || 'Luxury Couture Pieces | Custom Orders Available').split('|');

  return (
    <div className="announcement-bar">
      <div className="announcement-text">
        <span>{announcementParts[0]?.trim()}</span>
        {announcementParts[1] && (
          <>
            <span className="separator">|</span>
            <span>{announcementParts[1].trim()}</span>
          </>
        )}
      </div>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="announcement-action">
        <Phone size={14} className="icon" />
        <span>WhatsApp Support</span>
      </a>
    </div>
  );
};

export default AnnouncementBar;
