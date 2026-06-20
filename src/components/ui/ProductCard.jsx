'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useSiteData } from '@/context/SiteDataContext';
import Reveal from '@/components/ui/Reveal';

const ProductCard = ({ product, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { toggleWishlist, isInWishlist } = useShop();
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

  return (
    <Reveal className="product-card card-hover-lift" delay={delay}>
      <div
        className="product-image-container image-zoom-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${productId}`}>
          <img
            src={product.images?.[isHovered && product.images.length > 1 ? 1 : 0] || '/product_1.png'}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>
        
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''} ${clicked ? 'heart-pop' : ''}`}
          onClick={handleWishlistClick}
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <div className={`product-quick-actions ${isHovered ? 'visible' : ''}`}>
          <Link 
            href={`/product/${productId}`} 
            className="quick-action-btn view-details btn-click-feedback" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Eye size={16} /> View Details
          </Link>
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
