import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Contact Us</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
          We would love to hear from you. For inquiries, custom orders, or assistance, please reach out using the details below.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', textAlign: 'left' }}>
          <div style={{ padding: '30px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Phone size={32} style={{ color: 'var(--color-gold)' }} />
            <div>
              <h3 style={{ marginBottom: '5px' }}>Phone / WhatsApp</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '5px' }}>+91 7774056979</p>
              <a href="https://wa.me/917774056979" target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--color-black)', textDecoration: 'underline' }}>Message on WhatsApp</a>
            </div>
          </div>

          <div style={{ padding: '30px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Mail size={32} style={{ color: 'var(--color-gold)' }} />
            <div>
              <h3 style={{ marginBottom: '5px' }}>Email</h3>
              <a href="mailto:umeracouture@gmail.com" style={{ color: 'var(--color-text-muted)' }}>umeracouture@gmail.com</a>
            </div>
          </div>

          <div style={{ padding: '30px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <MapPin size={32} style={{ color: 'var(--color-gold)' }} />
            <div>
              <h3 style={{ marginBottom: '5px' }}>Studio Address</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Umera Couture<br />
                402, 5th Floor, Charyana Heights,<br />
                Beside Italian Bakery, Raikhad,<br />
                Ahmedabad, Gujarat - 380001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
