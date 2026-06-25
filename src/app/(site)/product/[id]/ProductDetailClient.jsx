'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Ruler, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import Reveal from '@/components/ui/Reveal';

export default function ProductDetailClient({ product, settings }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '/product_1.png');
  const [addingState, setAddingState] = useState('idle'); // 'idle' | 'adding' | 'added'
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

  const handleAddToBag = () => {
    if (isOutOfStock || isPriceMissing) return;
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }
    if (!selectedColor && product.colors?.length > 0) {
      alert('Please select a color');
      return;
    }

    setAddingState('adding');
    setTimeout(() => {
      addToCart(productForCart, selectedSize, selectedColor);
      setAddingState('added');
      setTimeout(() => {
        setAddingState('idle');
      }, 1500);
    }, 600);
  };

  const getButtonText = () => {
    if (isOutOfStock) return 'Out of Stock';
    if (isPriceMissing) return 'Unavailable for Online Purchase';
    if (addingState === 'adding') return 'Adding to Bag...';
    if (addingState === 'added') return 'Added to Bag ✓';
    return 'Add to Bag';
  };

  return (
    <div className="product-detail-page section-padding container">
      <div className="product-detail-grid">
        
        {/* Images */}
        <Reveal className="product-gallery">
          <div className="thumbnail-list">
            {images.map((img, index) => (
              <div 
                key={index}
                className={`thumbnail btn-click-feedback ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="80px"
                />
              </div>
            ))}
          </div>
          <div className="main-image-container image-zoom-container" style={{ position: 'relative' }}>
            <Image 
              key={activeImage}
              src={activeImage} 
              alt={product.name} 
              className="main-image fade-in" 
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        {/* Info */}
        <Reveal className="product-info-detail" delay={150}>
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
                    className={`size-btn btn-click-feedback ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
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
                    className={`size-btn btn-click-feedback ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="actions" style={{ marginTop: '2rem' }}>
            <button
              className="btn-primary whatsapp-order-btn btn-click-feedback"
              style={{ 
                marginBottom: '10px', 
                opacity: (isOutOfStock || isPriceMissing || addingState !== 'idle') ? 0.5 : 1, 
                cursor: (isOutOfStock || isPriceMissing || addingState !== 'idle') ? 'not-allowed' : 'pointer',
                backgroundColor: addingState === 'added' ? 'var(--color-gold)' : 'var(--color-black)',
                color: addingState === 'added' ? 'var(--color-black)' : '#fff',
                borderColor: addingState === 'added' ? 'var(--color-gold)' : 'var(--color-black)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              disabled={isOutOfStock || isPriceMissing || addingState !== 'idle'}
              onClick={handleAddToBag}
            >
              <ShoppingBag size={20} style={{ transform: addingState === 'added' ? 'scale(1.1)' : 'none', transition: 'transform 0.3s ease' }} /> 
              {getButtonText()}
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
        </Reveal>

      </div>
    </div>
  );
}
