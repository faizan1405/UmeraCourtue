import { getSettings } from '@/lib/data';
import { Sparkles, Gem, Feather, ShoppingBag, Heart, Star } from 'lucide-react';

export const metadata = {
  title: 'About Us | Umera Couture',
  description: 'Learn about the heritage, dedication, and modern craftsmanship that defines Umera Couture.',
  openGraph: {
    title: 'About Us | Umera Couture',
    description: 'Learn about the heritage, dedication, and modern craftsmanship that defines Umera Couture.',
  },
};

export default async function AboutPage() {
  const settings = await getSettings();
  const s = settings || {};

  return (
    <div className="container section-padding fade-in-up">
      {/* 1. Strong Heading */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '15px' }}>About Umera Couture</h1>
        <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--color-gold)', margin: '0 auto' }}></div>
      </div>

      {/* 2. Brand Introduction */}
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
          Welcome to Umera Couture. We are a premium fashion destination dedicated to bringing you elegant clothing, modern styling, and beautiful designs. With a deep appreciation for quality and aesthetics, our carefully curated pieces are crafted to offer a refined and luxurious shopping experience.
        </p>
      </div>

      {/* 3. Our Philosophy / Mission */}
      <div style={{ 
        backgroundColor: 'var(--color-champagne)', 
        padding: 'var(--spacing-xl)', 
        borderRadius: '12px',
        maxWidth: '1000px',
        margin: '0 auto var(--spacing-2xl)',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Our Philosophy</h2>
        <p style={{ 
          fontSize: '1.5rem', 
          fontFamily: 'var(--font-heading)', 
          fontStyle: 'italic', 
          color: 'var(--color-text)', 
          lineHeight: '1.8' 
        }}>
          {s.aboutText || '"Umera Couture is a celebration of timeless elegance and modern sophistication. We believe in creating thoughtfully designed pieces that blend luxury with individuality, ensuring every outfit inspires confidence, grace, and effortless style."'}
        </p>
      </div>

      {/* 4. Why Choose Umera Couture */}
      <div style={{ maxWidth: '1200px', margin: '0 auto var(--spacing-2xl)' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Why Choose Us</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          {/* Card 1 */}
          <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="hover-card">
            <Sparkles size={40} color="var(--color-gold)" style={{ margin: '0 auto var(--spacing-md)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Elegant & Modern Designs</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Thoughtfully crafted silhouettes that seamlessly blend contemporary trends with timeless elegance.</p>
          </div>
          {/* Card 2 */}
          <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="hover-card">
            <Gem size={40} color="var(--color-gold)" style={{ margin: '0 auto var(--spacing-md)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Quality-Focused Pieces</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Premium materials and meticulous attention to detail ensure every garment meets our highest standards.</p>
          </div>
          {/* Card 3 */}
          <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="hover-card">
            <Feather size={40} color="var(--color-gold)" style={{ margin: '0 auto var(--spacing-md)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Comfortable Styling</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>We believe true luxury is effortless, offering pieces that look beautiful and feel incredibly comfortable.</p>
          </div>
          {/* Card 4 */}
          <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="hover-card">
            <Star size={40} color="var(--color-gold)" style={{ margin: '0 auto var(--spacing-md)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Curated Collections</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Every piece in our collection is handpicked to offer a cohesive, versatile, and stylish wardrobe.</p>
          </div>
          {/* Card 5 */}
          <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="hover-card">
            <ShoppingBag size={40} color="var(--color-gold)" style={{ margin: '0 auto var(--spacing-md)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Smooth Online Shopping</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>A seamless, secure, and user-friendly platform designed to make finding your perfect outfit effortless.</p>
          </div>
          {/* Card 6 */}
          <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center', transition: 'var(--transition-smooth)' }} className="hover-card">
            <Heart size={40} color="var(--color-gold)" style={{ margin: '0 auto var(--spacing-md)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Customer-Focused</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Your satisfaction is our priority, with dedicated support ensuring a delightful experience at every step.</p>
          </div>
        </div>
      </div>

      {/* 5. Closing Statement */}
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingBottom: 'var(--spacing-lg)' }}>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text)', lineHeight: '1.8' }}>
          At Umera Couture, our ultimate goal is to help you feel confident, graceful, and beautifully dressed for every moment of your life.
        </p>
      </div>

      {/* Inline styles for hover effects since we are not modifying external CSS just for hover-card */}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-gold) !important;
        }
      `}} />
    </div>
  );
}
