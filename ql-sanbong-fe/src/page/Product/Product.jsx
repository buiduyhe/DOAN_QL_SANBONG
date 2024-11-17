import React, { useState } from 'react'
import DanhMuc from './DanhMuc/DanhMuc'
import Navbar from '../../component/Navbar/Navbar'
import SanPham from './SanPham/SanPham'
import Footer from '../../component/Footer/Footer'
const Product = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };
  return (
    <div>
        <Navbar cartCount={cartItems.length}/>
        <SanPham onAddToCart={handleAddToCart}/>
        <Footer/>
    </div>
  )
};

export default Product