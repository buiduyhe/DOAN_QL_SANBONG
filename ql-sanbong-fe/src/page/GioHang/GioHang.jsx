import React from 'react'
import { useCart } from '../../CartContext';  // Import useCart hook để truy cập dữ liệu giỏ hàng
import Navbar from '../../component/Navbar/Navbar'
import SanPhamDaDat from './SanPhamDaDat/SanPhamDaDat';

const GioHang = () => {
  const { cartItems, removeFromCart } = useCart();  // Lấy giỏ hàng và hàm xóa sản phẩm

  return (
    <div>
      <Navbar />
      <SanPhamDaDat cartItems={cartItems} />
    </div>
  )
}

export default GioHang;
