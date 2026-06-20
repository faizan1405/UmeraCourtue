import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, Ruler } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');

  // Dummy product for all IDs for now
  const product = {
    id,
    name: 'The Ivory Couture Gown',
    price: 'Price on Request',
    description: 'A breathtaking masterpiece of modern couture. This gown features delicate hand-embroidery, a sweeping train, and is crafted from the finest pure silk organza. Perfect for high-end events and bridal occasions.',
    fabricDetails: '100% Silk Organza, Pearl Embellishments, Silk Crepe Lining',
    careInstructions: 'Dry clean only. Store in provided garment bag away from direct sunlight.',
    colorNote: 'Please note: Due to lighting on images, color may vary slightly.',
    images: ['/product_1.png', '/product_2.png'],
    sizes: ['XS', 'S', 'M', 'L', 'Custom'],
  };

  const [activeImage, setActiveImage] = useState(product.images[0]);

  const whatsappMessage = encodeURIComponent(`Hi Umera Couture, I would like to order/inquire about: ${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ''}`);
  const whatsappUrl = `https://wa.me/917774056979?text=${whatsappMessage}`;

  return (
    <div className="product-detail-page section-padding container">
      <div className="product-detail-grid">
        
        {/* Images */}
        <div className="product-gallery">
          <div className="thumbnail-list">
            {product.images.map((img, index) => (
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
          <p className="price">{product.price}</p>
          
          <div className="description">
            <p>{product.description}</p>
          </div>

          <div className="size-selector">
            <div className="size-header">
              <span>Select Size</span>
              <button className="size-guide-btn"><Ruler size={14} /> Size Guide</button>
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

          <div className="actions">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary whatsapp-order-btn">
              <MessageCircle size={20} /> Order via WhatsApp
            </a>
            <p className="delivery-note">For Custom sizes, our team will guide you on measurements via WhatsApp.</p>
          </div>

          <div className="product-accordion">
            <div className="accordion-item">
              <h3>Fabric & Details</h3>
              <p>{product.fabricDetails}</p>
            </div>
            <div className="accordion-item">
              <h3>Care Instructions</h3>
              <p>{product.careInstructions}</p>
            </div>
            <div className="accordion-item color-note">
              <p><i>{product.colorNote}</i></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
