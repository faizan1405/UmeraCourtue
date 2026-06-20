'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useSiteData } from '@/context/SiteDataContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useShop();
  const { settings } = useSiteData();

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);
  const whatsappNum = settings?.whatsapp || '7774056979';

  const whatsappMessage = encodeURIComponent(
    product.whatsappMessage || `Hi Umera Couture, I would like to inquire about: ${product.name}`
  );
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${whatsappMessage}`;

  const productForWishlist = { ...product, id: productId };

  return (
    <div className="product-card fade-in-up">
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
          />
        </Link>
        
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(productForWishlist);
          }}
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <div className={`product-quick-actions ${isHovered ? 'visible' : ''}`}>
          <Link href={`/product/${productId}`} className="quick-action-btn view-details">
            <Eye size={16} /> View Details
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="quick-action-btn whatsapp">
            <MessageCircle size={16} /> Enquire
          </a>
        </div>
      </div>

      <div className="product-info">
        <Link href={`/product/${productId}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-price">{product.priceOnRequest ? 'Price on Request' : product.price}</p>
        <div className="product-sizes">
          {product.sizes?.map(size => (
            <span key={size} className="size-pill">{size}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
