'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('umera_cart');
    const savedWishlist = localStorage.getItem('umera_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    setMounted(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (mounted) localStorage.setItem('umera_cart', JSON.stringify(cart));
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem('umera_wishlist', JSON.stringify(wishlist));
  }, [wishlist, mounted]);

  const addToCart = (product, size) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some(item => item.id === id);
  };

  return (
    <ShopContext.Provider value={{
      cart,
      wishlist,
      isSearchOpen,
      setIsSearchOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      isInWishlist,
      mounted,
    }}>
      {children}
    </ShopContext.Provider>
  );
};
