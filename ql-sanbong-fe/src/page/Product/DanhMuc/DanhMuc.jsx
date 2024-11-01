import React from 'react';
import './DanhMuc.scss'; // Đường dẫn đến file SCSS
import quanao from '../../../assets/Product/QuanAo.png';
import gangtay from '../../../assets/Product/GangTay.png';
import giay from '../../../assets/Product/Giay.png';
import balo from '../../../assets/Product/Balo.png';
import phukien from '../../../assets/Product/PhuKien.png';

const DanhMuc = () => {
  return (
    <div className='DanhMuc'>
      <div className='sanpham'>TẤT CẢ SẢN PHẨM</div>
      <div className='DanhMucSP'>
        <div className='img-btn'>
          <img src={quanao} className='btn-img' alt='Quần Áo' />
          <span>Quần Áo</span>
        </div>
        <div className='img-btn'>
          <img src={gangtay} className='btn-img' alt='Găng Tay' />
          <span>Găng Tay</span>
        </div>
        <div className='img-btn'>
          <img src={giay} className='btn-img' alt='Giày' />
          <span>Giày</span>
        </div>
        <div className='img-btn'>
          <img src={balo} className='btn-img' alt='Balo' />
          <span>Balo</span>
        </div>
        <div className='img-btn'>
          <img src={phukien} className='btn-img' alt='Phụ Kiện' />
          <span>Phụ Kiện</span>
        </div>
      </div>
    </div>
  );
};

export default DanhMuc;
