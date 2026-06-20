import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useShop();
  
  const isWishlisted = isInWishlist(product.id);

  const whatsappMessage = encodeURIComponent(`Hi Umera Couture, I would like to inquire about: ${product.name}`);
  const whatsappUrl = `https://wa.me/917774056979?text=${whatsappMessage}`;

  return (
    <div className="product-card fade-in-up">
      <div 
        className="product-image-container image-zoom-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`}>
          <img 
            src={isHovered && product.hoverImage ? product.hoverImage : product.image} 
            alt={product.name} 
            className="product-image"
          />
        </Link>
        
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <div className={`product-quick-actions ${isHovered ? 'visible' : ''}`}>
          <Link to={`/product/${product.id}`} className="quick-action-btn view-details">
            <Eye size={16} /> View Details
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="quick-action-btn whatsapp">
            <MessageCircle size={16} /> Enquire
          </a>
        </div>
      </div>

      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-price">{product.price}</p>
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
