import { getSettings } from '@/lib/data';
import { Phone, Scissors, Ruler, Sparkles } from 'lucide-react';

export default async function CustomOrderPage() {
  const settings = await getSettings();
  const whatsappUrl = `https://wa.me/91${settings?.whatsapp || '7774056979'}?text=${encodeURIComponent("Hi Umera Couture, I would like to inquire about a custom order.")}`;

  return (
    <div className="container section-padding text-center" style={{ maxWidth: '800px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Custom Couture</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
        Experience the luxury of a garment crafted exclusively for you.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '60px', textAlign: 'left' }}>
        <div style={{ padding: '30px', backgroundColor: 'var(--color-beige)' }}>
          <Scissors size={28} style={{ marginBottom: '15px', color: 'var(--color-gold)' }} />
          <h3 style={{ marginBottom: '10px' }}>Bespoke Designs</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Collaborate with us to design a completely unique outfit.</p>
        </div>
        <div style={{ padding: '30px', backgroundColor: 'var(--color-beige)' }}>
          <Ruler size={28} style={{ marginBottom: '15px', color: 'var(--color-gold)' }} />
          <h3 style={{ marginBottom: '10px' }}>Perfect Fit</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Provide your exact measurements for a flawless fit.</p>
        </div>
        <div style={{ padding: '30px', backgroundColor: 'var(--color-beige)' }}>
          <Sparkles size={28} style={{ marginBottom: '15px', color: 'var(--color-gold)' }} />
          <h3 style={{ marginBottom: '10px' }}>Premium Fabrics</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Choose from our curated selection of high-end fabrics.</p>
        </div>
      </div>
      <div style={{ padding: '40px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ marginBottom: '15px' }}>Book Your Consultation</h2>
        <p style={{ marginBottom: '30px', color: 'var(--color-text-muted)' }}>Reach out on WhatsApp to begin your custom couture journey.</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Phone size={18} /> Message on WhatsApp
        </a>
      </div>
    </div>
  );
}
