import React from 'react'
import DanhMuc from './DanhMuc/DanhMuc'
import Navbar from '../../component/Navbar/Navbar'
import SanPham from './SanPham/SanPham'
import Footer from '../../component/Footer/Footer'
const Product = () => {
  return (
    <div>
        <Navbar/>
        <SanPham/>
        <Footer/>
    </div>
  )
}

export default Product