import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                totalPrice: (item.price || 0) * (item.quantity + 1)
              } 
            : item
        );
      }
      
      return [...prev, {
        id: product.id,
        title: product.title || 'Product',
        price: product.price || 0,
        quantity: 1,
        images: product.images || [product.image],
        image: product.image,
        brand: product.brand || 'Generic',
        stock: product.stock || 10,
        tags: product.tags || [],
        totalPrice: product.price || 0
      }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              quantity: quantity,
              totalPrice: (item.price || 0) * quantity
            } 
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};