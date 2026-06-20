import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useShop();

  const handleCheckout = () => {
    let message = `Hi Umera Couture! I'd like to place an order for the following items:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n   Size: ${item.size}\n   Quantity: ${item.quantity}\n\n`;
    });
    message += `Please let me know the total price and payment details. Thank you!`;
    
    const whatsappUrl = `https://wa.me/917774056979?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container section-padding" style={{ minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Your Bag</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <ShoppingBag size={48} style={{ color: 'var(--color-border)', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '15px' }}>Your bag is empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Looks like you haven't added any luxury pieces yet.</p>
          <Link to="/collections" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px' }}>
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} style={{ display: 'flex', padding: '20px', borderBottom: '1px solid var(--color-border)', gap: '20px' }}>
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '133px', objectFit: 'cover' }} />
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
              <button onClick={handleCheckout} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
