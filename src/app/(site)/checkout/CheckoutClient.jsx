'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CheckoutClient() {
  const { cart, clearCart, mounted } = useShop();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const getCartTotals = () => {
    let subtotal = 0;
    let hasPriceOnRequest = false;

    cart.forEach(item => {
      if (item.price === 'Price on Request' || !item.price) {
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
        subtotal: 'Price on Request',
        total: 'Price on Request',
        isPriceOnRequest: true,
      };
    }

    return {
      subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
      total: `₹${subtotal.toLocaleString('en-IN')}`,
      isPriceOnRequest: false,
    };
  };

  const totals = getCartTotals();
  const isPriceOnRequest = totals.isPriceOnRequest;
  const paymentMethod = 'online';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [simulatedPayment, setSimulatedPayment] = useState(null);

  // Handle server-side mount check
  if (!mounted) {
    return (
      <div className="container section-padding text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container section-padding text-center" style={{ minHeight: '60vh' }}>
        <ShoppingBag size={48} style={{ color: 'var(--color-border)', marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '15px' }}>Your bag is empty</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Add some luxury couture pieces to your bag before checking out.</p>
        <Link href="/collections" className="btn-primary">View Collections</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isPriceOnRequest) {
      setError('Your bag contains items that are unavailable for online checkout. Please remove them to proceed.');
      return;
    }

    const { customerName, phone, email, address, city, state, pincode } = formData;
    if (!customerName || !phone || !email || !address || !city || !state || !pincode) {
      setError('Please fill in all required delivery details.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create local Order in MongoDB (paymentStatus: pending)
      const mappedItems = cart.map(item => {
        const priceVal = item.price === 'Price on Request' || !item.price
          ? 'Price on Request'
          : parseFloat(item.price.toString().replace(/[^\d.]/g, ''));
        const totalVal = typeof priceVal === 'number'
          ? `₹${(priceVal * item.quantity).toLocaleString('en-IN')}`
          : 'Price on Request';
        return {
          productId: item.id,
          productName: item.name,
          productImage: item.image || '',
          size: item.size || '',
          color: item.color || '',
          quantity: item.quantity,
          unitPrice: item.price,
          lineTotal: totalVal,
        };
      });

      const orderPayload = {
        ...formData,
        items: mappedItems,
        subtotal: totals.subtotal,
        totalAmount: totals.total,
        paymentProvider: paymentMethod === 'online' ? 'razorpay' : 'manual',
        paymentMethod: paymentMethod === 'online' ? 'online' : 'manual',
        paymentStatus: 'pending',
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const localOrder = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(localOrder.error || 'Failed to place order');
      }

      // If Manual flow selected, checkout is immediately complete
      if (paymentMethod === 'manual') {
        clearCart();
        router.push(`/order-success/${localOrder._id}`);
        return;
      }

      // 2. Online Payment flow: Call Razorpay endpoint to create backend order
      const rzpOrderResponse = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: localOrder._id }),
      });

      const rzpData = await rzpOrderResponse.json();
      if (!rzpOrderResponse.ok) {
        throw new Error(rzpData.error || 'Payment gateway order initialization failed');
      }

      // Check if we should simulate payment (using dummy keys)
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || rzpData.keyId;
      if (rzpKey === 'rzp_test_DUMMYKEY123') {
        setLoading(false);
        setSimulatedPayment({
          amount: rzpData.amount,
          orderId: localOrder._id,
          razorpayOrderId: rzpData.id,
          handler: async function (response) {
            setLoading(true);
            try {
              // Verify payment signature on backend
              const verifyResponse = await fetch('/api/payments/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: localOrder._id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyResponse.json();
              if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Payment verification failed');
              }

              clearCart();
              router.push(`/order-success/${localOrder._id}`);
            } catch (err) {
              setError(err.message || 'Payment verification failed. Please contact WhatsApp support.');
              setLoading(false);
            }
          },
          ondismiss: function () {
            setLoading(false);
            setError('Payment process was closed. Your order details are saved, and you can retry paying.');
          }
        });
        return;
      }

      // 3. Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your network connection.');
      }

      // 4. Open Razorpay checkout pop-up
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Umera Couture',
        description: 'Order Payment Confirmation',
        order_id: rzpData.id,
        handler: async function (response) {
          setLoading(true);
          try {
            // Verify payment signature on backend
            const verifyResponse = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: localOrder._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            clearCart();
            router.push(`/order-success/${localOrder._id}`);
          } catch (err) {
            setError(err.message || 'Payment verification failed. Please contact WhatsApp support.');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#111111',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment process was closed. Your order details are saved, and you can retry paying.');
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div className="container section-padding" style={{ minHeight: '80vh' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} /> Back to Bag
        </Link>
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Checkout</h1>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fce4ec', color: '#c62828', borderRadius: '4px', marginBottom: '30px', fontSize: '0.95rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'start' }}>
          
          {/* Billing & Shipping Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', marginBottom: '10px' }}>Shipping Details</h2>
            
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required style={inputStyle} placeholder="Enter your full name" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} placeholder="Phone number" />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="Email address" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Full Delivery Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required style={inputStyle} placeholder="Street address, Apartment, Suite, etc." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required style={inputStyle} placeholder="City" />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required style={inputStyle} placeholder="State" />
              </div>
              <div>
                <label style={labelStyle}>Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required style={inputStyle} placeholder="Pincode" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Order Notes (Optional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Any special requests or measurement details..." />
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Payment Method</h2>
              <div style={{ padding: '15px', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Pay Online</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px', marginBottom: '0' }}>
                    UPI, Credit/Debit Cards, Netbanking (Razorpay Secure Checkout)
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '15px' }}>
                Having trouble paying online? Please contact support at the top header or message us directly on WhatsApp.
              </p>
            </div>

          </div>

          {/* Order Summary */}
          <div style={{ backgroundColor: 'var(--color-beige)', padding: '30px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color || ''}`} style={{ display: 'flex', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <img src={item.image || '/product_1.png'} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '2px' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '5px' }}>
                      Size: {item.size}{item.color ? ` | Color: ${item.color}` : ''}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span>Qty: {item.quantity}</span>
                      <span style={{ fontWeight: '500' }}>{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span style={{ fontWeight: '500' }}>{totals.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '600', borderTop: '1px solid var(--color-border)', paddingTop: '15px', marginTop: '10px' }}>
                <span>Total</span>
                <span>{totals.total}</span>
              </div>
            </div>

            <button type="submit" disabled={loading || isPriceOnRequest} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '10px', opacity: isPriceOnRequest ? 0.5 : 1, cursor: isPriceOnRequest ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Processing...' : 'Pay & Place Order'}
            </button>
          </div>

        </div>
      </form>

      {/* Simulated Razorpay Modal */}
      {simulatedPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          fontFamily: 'Montserrat, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '8px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <img src="/umera-logo.png" alt="Umera Couture" style={{ height: '50px', marginInline: 'auto' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#111' }}>Razorpay Payment Gateway</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>Simulated Test Environment</p>
            
            <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '4px', marginBottom: '30px', fontSize: '1.05rem', fontWeight: '600' }}>
              Amount: ₹{(simulatedPayment.amount / 100).toLocaleString('en-IN')}.00
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button" 
                onClick={async () => {
                  const handler = simulatedPayment.handler;
                  const orderId = simulatedPayment.orderId;
                  const rzpOrderId = simulatedPayment.razorpayOrderId;
                  setSimulatedPayment(null);
                  setLoading(true);
                  await handler({
                    razorpay_order_id: rzpOrderId,
                    razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
                    razorpay_signature: 'mock_signature'
                  });
                }} 
                style={{
                  backgroundColor: '#111111',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Simulate Successful Payment
              </button>

              <button 
                type="button" 
                onClick={() => {
                  const ondismiss = simulatedPayment.ondismiss;
                  setSimulatedPayment(null);
                  ondismiss();
                }} 
                style={{
                  backgroundColor: 'transparent',
                  color: '#666',
                  border: '1px solid #ccc',
                  padding: '12px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Simulate Cancel/Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
