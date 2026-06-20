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
        <Reveal className="cart-grid-layout" delay={150}>
          <div className="cart-items-wrapper">
            {cart.map((item) => {
              const itemKey = `${item.id}-${item.size}-${item.color || ''}`;
              const isRemoving = removingKeys.includes(itemKey);

              return (
                <div 
                  key={itemKey} 
                  className={`cart-item-container ${isRemoving ? 'removing' : ''}`}
                >
                  <img src={item.image || '/product_1.png'} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.name}</h3>
                    <p className="cart-item-meta">
                      Size: {item.size}{item.color ? ` | Color: ${item.color}` : ''}
                    </p>
                    <p className="cart-item-price">
                      {item.price} {item.quantity > 1 && `(Total: ${getItemLineTotal(item)})`}
                    </p>
                    <div className="cart-item-actions">
                      <div className="cart-qty-selector">
                        <button
                          className="cart-qty-btn btn-click-feedback"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        >-</button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn btn-click-feedback"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        >+</button>
                      </div>
                      <button
                        className="cart-remove-btn btn-click-feedback"
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="cart-checkout-block">
              <div className="cart-summary-totals">
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
