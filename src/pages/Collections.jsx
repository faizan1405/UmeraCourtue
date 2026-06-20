import React from 'react';
import ProductCard from '../components/ui/ProductCard';

const Collections = () => {
  const products = [
    {
      id: 1,
      name: 'The Ivory Gown',
      price: 'Price on Request',
      image: '/product_1.png',
      sizes: ['XS', 'S', 'M', 'L', 'Custom'],
    },
    {
      id: 2,
      name: 'Champagne Elegance',
      price: 'Price on Request',
      image: '/product_2.png',
      sizes: ['S', 'M', 'L', 'Custom'],
    },
    {
      id: 3,
      name: 'Midnight Noir Dress',
      price: 'Price on Request',
      image: '/product_1.png',
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      id: 4,
      name: 'Blush Dream Couture',
      price: 'Price on Request',
      image: '/product_2.png',
      sizes: ['Custom Only'],
    },
    {
      id: 5,
      name: 'Golden Aura Ensemble',
      price: 'Price on Request',
      image: '/product_1.png',
      sizes: ['S', 'M', 'L'],
    },
    {
      id: 6,
      name: 'Pearl Embroidered Dress',
      price: 'Price on Request',
      image: '/product_2.png',
      sizes: ['XS', 'S', 'M'],
    }
  ];

  return (
    <div className="container section-padding">
      <div className="section-header text-center margin-bottom-lg fade-in-up">
        <h1>All Collections</h1>
        <p>Explore our full range of luxury couture pieces.</p>
      </div>
      
      <div className="products-grid fade-in-up" style={{ animationDelay: '0.2s' }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Collections;
