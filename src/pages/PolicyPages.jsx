import React from 'react';

export const PrivacyPolicy = () => (
  <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
    <h1 style={{ marginBottom: '30px' }}>Privacy Policy</h1>
    <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
      <p style={{ marginBottom: '20px' }}>At Umera Couture, we value your privacy and are committed to protecting your personal information.</p>
      <h3 style={{ margin: '20px 0 10px', color: 'var(--color-black)' }}>Information We Collect</h3>
      <p style={{ marginBottom: '20px' }}>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, and measurement details for custom tailoring.</p>
      <h3 style={{ margin: '20px 0 10px', color: 'var(--color-black)' }}>How We Use Your Information</h3>
      <p style={{ marginBottom: '20px' }}>We use the information we collect to fulfill your custom orders, provide customer service, and communicate with you about products, services, offers, and promotions from Umera Couture.</p>
    </div>
  </div>
);

export const Terms = () => (
  <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
    <h1 style={{ marginBottom: '30px' }}>Terms & Conditions</h1>
    <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
      <p style={{ marginBottom: '20px' }}>Welcome to Umera Couture. By accessing or using our website, you agree to be bound by these terms.</p>
      <h3 style={{ margin: '20px 0 10px', color: 'var(--color-black)' }}>Custom Orders</h3>
      <p style={{ marginBottom: '20px' }}>All custom couture pieces require a 50% advance payment before production begins. Because these items are tailored to your specific measurements, custom orders cannot be cancelled once production has started.</p>
      <h3 style={{ margin: '20px 0 10px', color: 'var(--color-black)' }}>Product Variations</h3>
      <p style={{ marginBottom: '20px' }}>Due to the handcrafted nature of our garments and variations in display screens, slight variations in color and embellishment placement may occur. These are not considered defects but rather part of the unique beauty of couture.</p>
    </div>
  </div>
);

export const ShippingReturns = () => (
  <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
    <h1 style={{ marginBottom: '30px' }}>Shipping & Returns</h1>
    <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
      <h3 style={{ margin: '20px 0 10px', color: 'var(--color-black)' }}>Shipping Policy</h3>
      <p style={{ marginBottom: '20px' }}>We offer worldwide shipping. Ready-to-wear pieces are dispatched within 3-5 business days. Custom couture pieces require 3-6 weeks for production, depending on the complexity of the design. You will be notified of the estimated delivery timeline during your WhatsApp consultation.</p>
      <h3 style={{ margin: '20px 0 10px', color: 'var(--color-black)' }}>Return Policy</h3>
      <p style={{ marginBottom: '20px' }}>For ready-to-wear items, we accept returns within 7 days of delivery, provided the item is unworn, unwashed, and in its original condition with all tags attached. <strong>Please note that custom-tailored pieces are final sale and cannot be returned or exchanged.</strong></p>
    </div>
  </div>
);
