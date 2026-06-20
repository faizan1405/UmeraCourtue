'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Ruler, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function ProductDetailClient({ product, settings }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '/product_1.png');
  const { addToCart } = useShop();

  const whatsappNum = settings?.whatsapp || '7774056979';
  const whatsappMessage = encodeURIComponent(
    product.whatsappMessage || `Hi Umera Couture, I would like to order/inquire about: ${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ''}`
  );
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${whatsappMessage}`;

  const displayPrice = product.priceOnRequest ? 'Price on Request' : product.price;
  const images = product.images?.length > 0 ? product.images : ['/product_1.png', '/product_2.png'];

  const productForCart = {
    id: product._id,
    name: product.name,
    price: displayPrice,
    image: images[0],
  };

  return (
    <div className="product-detail-page section-padding container">
      <div className="product-detail-grid">
        
        {/* Images */}
        <div className="product-gallery">
          <div className="thumbnail-list">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
          <div className="main-image-container image-zoom-container">
            <img src={activeImage} alt={product.name} className="main-image" />
          </div>
        </div>

        {/* Info */}
        <div className="product-info-detail">
          <h1>{product.name}</h1>
          <p className="price">{displayPrice}</p>
          
          <div className="description">
            <p>{product.fullDescription || product.shortDescription || ''}</p>
          </div>

          {product.sizes?.length > 0 && (
            <div className="size-selector">
              <div className="size-header">
                <span>Select Size</span>
                <Link href="/size-guide" className="size-guide-btn"><Ruler size={14} /> Size Guide</Link>
              </div>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="actions">
            <button
              className="btn-primary whatsapp-order-btn"
              style={{ marginBottom: '10px' }}
              onClick={() => {
                if (!selectedSize && product.sizes?.length > 0) {
                  alert('Please select a size');
                  return;
                }
                addToCart(productForCart, selectedSize);
                alert('Added to Bag!');
              }}
            >
              <ShoppingBag size={20} /> Add to Bag
            </button>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-outline whatsapp-order-btn">
              <MessageCircle size={20} /> Order via WhatsApp
            </a>
            <p className="delivery-note">For Custom sizes, our team will guide you on measurements via WhatsApp.</p>
          </div>

          <div className="product-accordion">
            {product.fabricDetails && (
              <div className="accordion-item">
                <h3>Fabric & Details</h3>
                <p>{product.fabricDetails}</p>
              </div>
            )}
            {product.careInstructions && (
              <div className="accordion-item">
                <h3>Care Instructions</h3>
                <p>{product.careInstructions}</p>
              </div>
            )}
            <div className="accordion-item color-note">
              <p><i>Please note: Due to lighting on images, color may vary slightly.</i></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
