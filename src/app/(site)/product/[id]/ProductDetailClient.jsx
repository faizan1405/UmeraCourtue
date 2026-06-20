'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Ruler, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function ProductDetailClient({ product, settings }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '/product_1.png');
  const { addToCart } = useShop();

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const whatsappNum = settings?.whatsapp || '7774056979';
  
  const specDetails = [
    selectedSize ? `Size: ${selectedSize}` : '',
    selectedColor ? `Color: ${selectedColor}` : ''
  ].filter(Boolean).join(', ');
  
  const whatsappMessage = encodeURIComponent(
    product.whatsappMessage || `Hi Umera Couture, I would like to order/inquire about: ${product.name}${specDetails ? ` (${specDetails})` : ''}`
  );
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${whatsappMessage}`;

  const isPriceMissing = product.priceOnRequest || !product.price;
  const displayPrice = isPriceMissing ? 'Price details missing' : product.price;
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

          {product.colors?.length > 0 && (
            <div className="size-selector" style={{ marginTop: '1.5rem' }}>
              <div className="size-header">
                <span>Select Color</span>
              </div>
              <div className="size-options">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`size-btn ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="actions">
            <button
              className="btn-primary whatsapp-order-btn"
              style={{ 
                marginBottom: '10px', 
                opacity: (isOutOfStock || isPriceMissing) ? 0.5 : 1, 
                cursor: (isOutOfStock || isPriceMissing) ? 'not-allowed' : 'pointer' 
              }}
              disabled={isOutOfStock || isPriceMissing}
              onClick={() => {
                if (isOutOfStock || isPriceMissing) return;
                if (!selectedSize && product.sizes?.length > 0) {
                  alert('Please select a size');
                  return;
                }
                if (!selectedColor && product.colors?.length > 0) {
                  alert('Please select a color');
                  return;
                }
                addToCart(productForCart, selectedSize, selectedColor);
                alert('Added to Bag!');
              }}
            >
              <ShoppingBag size={20} /> {isOutOfStock ? 'Out of Stock' : (isPriceMissing ? 'Unavailable for Online Purchase' : 'Add to Bag')}
            </button>
            <p className="delivery-note">For Custom sizes, our team will guide you on measurements after checkout.</p>
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
