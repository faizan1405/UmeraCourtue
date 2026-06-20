'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useSiteData } from '@/context/SiteDataContext';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useShop();
  const { settings } = useSiteData();
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const whatsappNum = settings?.whatsapp || '7774056979';

  const handleCheckout = async () => {
    // Save enquiry to MongoDB before opening WhatsApp
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone: customerPhone,
          items: cart.map(item => ({
            productName: item.name,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });
    } catch (e) {
      console.error('Failed to save enquiry:', e);
    }

    let message = `Hi Umera Couture! I'd like to place an order for the following items:\n\n`;
    if (customerName) message += `Name: ${customerName}\n`;
    if (customerPhone) message += `Phone: ${customerPhone}\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n   Size: ${item.size}\n   Quantity: ${item.quantity}\n\n`;
    });
    message += `Please let me know the total price and payment details. Thank you!`;
    
    const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowModal(false);
  };

  return (
    <div className="container section-padding" style={{ minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Your Bag</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <ShoppingBag size={48} style={{ color: 'var(--color-border)', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '15px' }}>Your bag is empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Looks like you haven&apos;t added any luxury pieces yet.</p>
          <Link href="/collections" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px' }}>
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} style={{ display: 'flex', padding: '20px', borderBottom: '1px solid var(--color-border)', gap: '20px' }}>
                <img src={item.image || '/product_1.png'} alt={item.name} style={{ width: '100px', height: '133px', objectFit: 'cover' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Size: {item.size}</p>
                  <p style={{ fontWeight: '500', marginBottom: '15px' }}>{item.price}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                      <button
                        style={{ padding: '5px 10px', backgroundColor: 'var(--color-beige)' }}
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      >-</button>
                      <span style={{ padding: '0 15px' }}>{item.quantity}</span>
                      <button
                        style={{ padding: '5px 10px', backgroundColor: 'var(--color-beige)' }}
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      >+</button>
                    </div>
                    <button
                      style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div style={{ padding: '30px', backgroundColor: 'var(--color-beige)', textAlign: 'right' }}>
              <p style={{ marginBottom: '10px', color: 'var(--color-text-muted)' }}>Shipping & taxes calculated at checkout</p>
              <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', textAlign: 'left' }}>
            <h3 className="modal-title" style={{ textAlign: 'center' }}>Complete Your Order</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>Enter your details before we redirect to WhatsApp</p>
            <div style={{ marginBottom: '1rem' }}>
              <label className="field-label">Your Name</label>
              <input className="admin-input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter your name" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="field-label">Phone Number</label>
              <input className="admin-input" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Enter your phone number" />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-outline" style={{ padding: '10px 24px' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={handleCheckout}>Send to WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
