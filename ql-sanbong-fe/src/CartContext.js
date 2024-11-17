import React, { createContext, useState, useContext } from 'react';

// Tạo context
const CartContext = createContext();

// Tạo provider để cung cấp giỏ hàng cho các component con
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng context
export const useCart = () => useContext(CartContext);
