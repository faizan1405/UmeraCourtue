'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useSiteData } from '@/context/SiteDataContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function CartClient() {
  const { cart, removeFromCart, updateQuantity, mounted } = useShop();
  const { settings } = useSiteData();
  const [removingKeys, setRemovingKeys] = useState([]);

  const getCartTotals = () => {
    let subtotal = 0;
    let hasPriceOnRequest = false;

    cart.forEach(item => {
      if (item.price === 'Price on Request' || !item.price || item.price === 'Price details missing') {
        hasPriceOnRequest = true;
      } else {
        const cleanedPrice = parseFloat(item.price.toString().replace(/[^\d.]/g, ''));
        if (isNaN(cleanedPrice)) {
          hasPriceOnRequest = true;
        } else {
          subtotal += cleanedPrice * item.quantity;
        }
      }
    });

    if (hasPriceOnRequest) {
      return {
        subtotal: 'Price details missing',
        total: 'Price details missing',
        isPriceOnRequest: true,
      };
    }

    return {
      subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
      total: `₹${subtotal.toLocaleString('en-IN')}`,
      isPriceOnRequest: false,
    };
  };

  const getItemLineTotal = (item) => {
    if (item.price === 'Price on Request' || !item.price || item.price === 'Price details missing') {
      return 'Price details missing';
    }
    const cleanedPrice = parseFloat(item.price.toString().replace(/[^\d.]/g, ''));
    if (isNaN(cleanedPrice)) {
      return 'Price details missing';
    }
    return `₹${(cleanedPrice * item.quantity).toLocaleString('en-IN')}`;
  };

  const handleRemoveItem = (id, size, color) => {
    const key = `${id}-${size}-${color || ''}`;
    setRemovingKeys(prev => [...prev, key]);
    setTimeout(() => {
      removeFromCart(id, size, color);
      setRemovingKeys(prev => prev.filter(k => k !== key));
    }, 400);
  };

  const totals = getCartTotals();

  if (!mounted) {
    return (
      <div className="container section-padding text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Loading bag...</p>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ minHeight: '60vh' }}>
      <Reveal>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Your Bag</h1>
      </Reveal>
      
      {cart.length === 0 ? (
        <Reveal style={{ textAlign: 'center', padding: '60px 0' }}>
          <ShoppingBag size={48} style={{ color: 'var(--color-border)', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '15px' }}>Your bag is empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Looks like you haven&apos;t added any luxury pieces yet.</p>
          <Link href="/collections" className="btn-primary btn-click-feedback">Continue Shopping</Link>
        </Reveal>
      ) : (
        <Reveal style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} delay={150}>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
            {cart.map((item) => {
              const itemKey = `${item.id}-${item.size}-${item.color || ''}`;
              const isRemoving = removingKeys.includes(itemKey);

              return (
                <div 
                  key={itemKey} 
                  style={{ 
                    display: 'flex', 
                    padding: isRemoving ? '0px 20px' : '20px', 
                    borderBottom: isRemoving ? 'none' : '1px solid var(--color-border)', 
                    gap: '20px',
                    maxHeight: isRemoving ? '0px' : '300px',
                    opacity: isRemoving ? 0 : 1,
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <img src={item.image || '/product_1.png'} alt={item.name} style={{ width: '100px', height: '133px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
                      Size: {item.size}{item.color ? ` | Color: ${item.color}` : ''}
                    </p>
                    <p style={{ fontWeight: '500', marginBottom: '15px' }}>
                      {item.price} {item.quantity > 1 && `(Total: ${getItemLineTotal(item)})`}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                        <button
                          className="btn-click-feedback"
                          style={{ padding: '5px 10px', backgroundColor: 'var(--color-beige)', fontWeight: 'bold' }}
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        >-</button>
                        <span style={{ padding: '0 15px' }}>{item.quantity}</span>
                        <button
                          className="btn-click-feedback"
                          style={{ padding: '5px 10px', backgroundColor: 'var(--color-beige)', fontWeight: 'bold' }}
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        >+</button>
                      </div>
                      <button
                        className="btn-click-feedback"
                        style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div style={{ padding: '30px', backgroundColor: 'var(--color-beige)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', width: '100%', maxWidth: '350px', fontSize: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '15px', marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                  <span style={{ fontWeight: '500' }}>{totals.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '1.25rem', fontWeight: '600', marginTop: '5px' }}>
                  <span>Total</span>
                  <span>{totals.total}</span>
                </div>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Shipping & taxes calculated at checkout</p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Link href="/checkout" className="btn-primary btn-click-feedback" style={{ padding: '14px 30px' }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
