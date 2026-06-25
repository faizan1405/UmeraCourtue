'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useSiteData } from '@/context/SiteDataContext';
import Reveal from '@/components/ui/Reveal';

const ProductCard = ({ product, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [addingState, setAddingState] = useState('idle');
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const { settings } = useSiteData();

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const productForWishlist = { ...product, id: productId };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(productForWishlist);
    setClicked(true);
  };

  useEffect(() => {
    if (clicked) {
      const t = setTimeout(() => setClicked(false), 400);
      return () => clearTimeout(t);
    }
  }, [clicked]);

  const isPriceMissing = product.priceOnRequest || !product.price;
  const hasVariants = (product.sizes?.length > 0) || (product.colors?.length > 0);

  const handleAddBlindly = (e) => {
    e.preventDefault();
    if (isPriceMissing) return;

    setAddingState('adding');
    setTimeout(() => {
      const productForCart = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/product_1.png',
      };
      
      addToCart(productForCart, '', '');
      setAddingState('added');
      setTimeout(() => setAddingState('idle'), 1500);
    }, 300);
  };

  return (
    <Reveal className="product-card card-hover-lift" delay={delay}>
      <div
        className="product-image-container image-zoom-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${productId}`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
          <Image
            src={product.images?.[isHovered && product.images.length > 1 ? 1 : 0] || '/product_1.png'}
            alt={product.name}
            className="product-image"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
        
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''} ${clicked ? 'heart-pop' : ''}`}
          onClick={handleWishlistClick}
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <div className={`product-quick-actions ${isHovered ? 'visible' : ''}`}>
          {isPriceMissing ? (
            <Link 
              href={`/product/${productId}`} 
              className="quick-action-btn view-details btn-click-feedback" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Eye size={16} /> View Details
            </Link>
          ) : hasVariants ? (
            <Link 
              href={`/product/${productId}`} 
              className="quick-action-btn view-details btn-click-feedback" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <ShoppingBag size={16} /> Select Options
            </Link>
          ) : (
            <button 
              onClick={handleAddBlindly}
              className="quick-action-btn view-details btn-click-feedback" 
              style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
              disabled={addingState !== 'idle'}
            >
              <ShoppingBag size={16} /> {addingState === 'idle' ? 'Add to Bag' : addingState === 'adding' ? 'Adding...' : 'Added ✓'}
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        <Link href={`/product/${productId}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-price">{product.priceOnRequest || !product.price ? 'Price details missing' : product.price}</p>
        <div className="product-sizes">
          {product.sizes?.map(size => (
            <span key={size} className="size-pill">{size}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default ProductCard;
