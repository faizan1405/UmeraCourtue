import { getSettings } from '@/lib/data';

export default async function AboutPage() {
  const settings = await getSettings();
  const s = settings || {};

  return (
    <div className="container section-padding">
      <div className="about-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Our Story</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.8' }}>
          Welcome to Umera Couture.
        </p>
        <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', marginBottom: '40px', lineHeight: '1.8' }}>
          {s.aboutText || '"Umera Couture is a celebration of timeless elegance, refined craftsmanship, and modern sophistication. We create thoughtfully designed pieces that blend luxury with individuality, ensuring every outfit tells a story of confidence, grace, and style."'}
        </p>
        <div style={{ backgroundColor: 'var(--color-champagne)', padding: '40px', borderRadius: '4px' }}>
          <h3 style={{ marginBottom: '15px' }}>Our Vision</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            We believe that true luxury lies in the details. From the initial sketch to the final stitch, our team of artisans pours their passion into creating garments that make you feel extraordinary. Our collections are inspired by global fashion trends while maintaining a timeless appeal that transcends seasons.
          </p>
        </div>
      </div>
    </div>
  );
}
