import React, { useState } from 'react'; // Import useState
import './DanhMuc.scss'; // Đường dẫn đến file SCSS
import quanao from '../../../assets/Product/QuanAo.png';
import gangtay from '../../../assets/Product/GangTay.png';
import giay from '../../../assets/Product/Giay.png';
import balo from '../../../assets/Product/Balo.png';
import phukien from '../../../assets/Product/PhuKien.png';

const DanhMuc = () => {
  // Initialize state for display text
  const [displayText, setDisplayText] = useState('TẤT CẢ SẢN PHẨM');

  // Function to handle button click
  const handleButtonClick = (category) => {
    if (category === 'quanao') {
      setDisplayText('QUẦN ÁO ĐÁ BÓNG');
    } else if (category === 'gangtay') {
      setDisplayText('GĂNG TAY THỦ MÔN');
    } else if (category === 'giay') {
      setDisplayText('GIÀY BÓNG ĐÁ');
    } else if (category === 'balo') {
      setDisplayText('BALO BÓNG ĐÁ');
    } else if (category === 'phukien') {
      setDisplayText('PHỤ KIỆN BÓNG ĐÁ');
    }
  };

  return (
    <div className='DanhMuc'>
      <div className='sanpham'>{displayText}</div> {/* Render the state variable */}
      <div className='DanhMucSP'>
        <div className='img-btn' onClick={() => handleButtonClick('quanao')}> {/* Add onClick handler */}
          <img src={quanao} className='btn-img' alt='Quần Áo' />
          <span>Quần Áo</span>
        </div>
        <div className='img-btn' onClick={() => handleButtonClick('gangtay')}>
          <img src={gangtay} className='btn-img' alt='Găng Tay' />
          <span>Găng Tay</span>
        </div>
        <div className='img-btn' onClick={() => handleButtonClick('giay')}>
          <img src={giay} className='btn-img' alt='Giày' />
          <span>Giày</span>
        </div>
        <div className='img-btn' onClick={() => handleButtonClick('balo')}>
          <img src={balo} className='btn-img' alt='Balo' />
          <span>Balo</span>
        </div>
        <div className='img-btn' onClick={() => handleButtonClick('phukien')}>
          <img src={phukien} className='btn-img' alt='Phụ Kiện' />
          <span>Phụ Kiện</span>
        </div>
      </div>
    </div>
  );
};

export default DanhMuc;
