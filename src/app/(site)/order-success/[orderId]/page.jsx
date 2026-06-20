import React from 'react';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getSettings } from '@/lib/data';
import { CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';

export default async function OrderSuccessPage({ params }) {
  const { orderId } = await params;
  
  let order = null;
  let settings = null;
  try {
    await connectDB();
    order = await Order.findById(orderId).lean();
    settings = await getSettings();
  } catch (e) {
    console.error('Error fetching order on success page:', e);
  }

  if (!order) {
    return (
      <div className="container section-padding text-center" style={{ minHeight: '60vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Order Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>
          We could not find order details for ID: {orderId}
        </p>
        <Link href="/collections" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const whatsappNum = settings?.whatsapp || '7774056979';

  // Build a clean WhatsApp message summarizing the order
  const specDetails = order.items.map((item, index) => {
    const specs = [
      item.size ? `Size: ${item.size}` : '',
      item.color ? `Color: ${item.color}` : ''
    ].filter(Boolean).join(', ');
    return `${index + 1}. ${item.productName} ${specs ? `(${specs})` : ''} x${item.quantity}`;
  }).join('\n');

  const whatsappMsg = `Hi Umera Couture! I have successfully placed an order (Order ID: #${order._id.toString()}). Here is my order summary:\n\n${specDetails}\n\nTotal: ${order.totalAmount}\n\nMy delivery details:\nName: ${order.customerName}\nAddress: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}\n\nPlease share the payment details to confirm my order. Thank you!`;
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="container section-padding" style={{ minHeight: '80vh', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Success Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="fade-in-up">
        <CheckCircle2 size={64} style={{ color: 'var(--color-gold)', marginBottom: '20px', marginInline: 'auto' }} />
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Order Confirmed</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Thank you for choosing Umera Couture. Your order has been placed successfully.
        </p>
      </div>

      {/* Payment Status Info */}
      {order.paymentStatus === 'paid' ? (
        <div style={{ backgroundColor: '#f4fbf7', borderLeft: '4px solid #2e7d32', padding: '20px', borderRadius: '4px', marginBottom: '30px' }} className="fade-in-up">
          <h3 style={{ marginBottom: '8px', color: '#2e7d32' }}>Payment Status: Successful</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            Thank you! Your payment has been received and verified. Your order is now confirmed. 
            If you have custom measurement requests or want to coordinate styling details, click below to message us directly on WhatsApp.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '15px', padding: '12px 24px', fontSize: '0.95rem', backgroundColor: '#2e7d32', borderColor: '#2e7d32', color: '#fff' }}>
            <MessageCircle size={18} /> Message on WhatsApp
          </a>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--color-beige)', borderLeft: '4px solid var(--color-gold)', padding: '20px', borderRadius: '4px', marginBottom: '30px' }} className="fade-in-up">
          <h3 style={{ marginBottom: '8px', color: 'var(--color-black)' }}>Payment Status: Pending Approval</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            Because our items are handcrafted luxury couture and custom orders, we manually review and coordinate payments. 
            To confirm your payment details and finalize production timing, please click below to send a message directly to our WhatsApp support team.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '15px', padding: '12px 24px', fontSize: '0.95rem' }}>
            <MessageCircle size={18} /> Confirm on WhatsApp
          </a>
        </div>
      )}

      {/* Order Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '30px' }} className="fade-in-up">
        
        {/* Order ID */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '15px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Number</span>
            <h3 style={{ fontSize: '1.2rem', marginTop: '2px' }}>#{order._id.toString()}</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Placed Date</span>
            <p style={{ fontWeight: '500', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Customer & Delivery Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Shipping To</h4>
            <p style={{ fontWeight: '600' }}>{order.customerName}</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginTop: '4px' }}>
              {order.address},<br />
              {order.city}, {order.state} - {order.pincode}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Contact Information</h4>
            <p style={{ fontSize: '0.9rem' }}>Phone: {order.phone}</p>
            <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Email: {order.email}</p>
          </div>
        </div>

        {/* Items Summary */}
        <div>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px', color: 'var(--color-text-muted)' }}>Items Summary</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {order.items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '15px', paddingBottom: '15px', borderBottom: index < order.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                <img src={item.productImage || '/product_1.png'} alt={item.productName} style={{ width: '50px', height: '67px', objectFit: 'cover' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.productName}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Size: {item.size || 'Custom'}{item.color ? ` | Color: ${item.color}` : ''}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '4px' }}>
                    <span>Qty: {item.quantity}</span>
                    <span style={{ fontWeight: '500' }}>{item.lineTotal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Amount */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '15px', fontSize: '1.25rem', fontWeight: '600' }}>
          <span>Total Amount</span>
          <span>{order.totalAmount}</span>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link href="/collections" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={16} /> Continue Shopping
        </Link>
      </div>

    </div>
  );
}
