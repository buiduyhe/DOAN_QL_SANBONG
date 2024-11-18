import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';  // Đảm bảo đã cài thư viện js-cookie

// Khởi tạo context giỏ hàng
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Lấy username từ Cookies (hoặc user_id nếu bạn dùng user_id)
  const username = Cookies.get("username");

  const [cartItems, setCartItems] = useState(() => {
    // Kiểm tra nếu username có và lấy giỏ hàng theo username
    const savedCart = username ? localStorage.getItem(`cartItems_${username}`) : null;
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === product.id);
      if (itemExists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 } // Tăng số lượng sản phẩm
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  // Cập nhật localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    if (username) {
      // Lưu giỏ hàng vào localStorage theo username
      localStorage.setItem(`cartItems_${username}`, JSON.stringify(cartItems));
    }
  }, [cartItems, username]);

  // Hàm lấy tổng số lượng trong giỏ hàng
  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
