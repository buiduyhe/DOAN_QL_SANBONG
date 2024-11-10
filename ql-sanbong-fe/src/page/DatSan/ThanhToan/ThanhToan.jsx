import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../../component/Navbar/Navbar';
import Stepper from '../Stepper/Stepper';
import './ThanhToan.scss';

const ThanhToan = () => {
  const location = useLocation();
  const { selectedField, selectedDate, timeSlot } = location.state || {};
  const { LoaiSan, id, Gia } = selectedField || {};
  const [isSuccess, setIsSuccess] = useState(false);

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDatSan = async () => {
    const data = {
      LoaiSan,
      GioCheckin: selectedDate,
      GioCheckout: new Date(new Date(selectedDate).getTime() + 90 * 60000).toISOString(),
      ThoiGian: 90,
      TinhTrang: 'Da Dat San',
      Gia,
      id
    };
  
    try {
      const response = await fetch('https://672b14c2976a834dd0258200.mockapi.io/DatSan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setIsSuccess(true);
        console.log("Success:", await response.json()); // In dữ liệu phản hồi để kiểm tra
      } else {
        console.log("Failed Response:", await response.text()); // In lỗi từ API
        alert('Đặt sân không thành công, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="thanh-toan">
      <Navbar />
      <Stepper />
      <div className="thanh-toan-content">
        <h2>Thông Tin Đặt Sân</h2>
        {selectedField ? (
          <div className="field-info">
            <p>{LoaiSan === 'San 7' ? 'Sân bóng đá 7 người' : 'Sân bóng mini 5 người'}</p>
            <p>Loại sân: <strong>{LoaiSan} - {id}</strong></p>
            <p>Ngày đặt: <strong>{formatDate(selectedDate)}</strong></p>
            <p>Thời gian: <strong>{timeSlot || '--'}</strong></p>
            <div className="total-amount">
              <p>Tổng cộng: </p>
              <p><strong>{Gia?.toLocaleString('vi-VN')} VND</strong></p>
            </div>
            <button className="pay-button" onClick={handleDatSan}>Đặt Sân</button>
            {isSuccess && <p className="success-message">Đặt sân thành công!</p>}
          </div>
        ) : (
          <p>Không có thông tin đặt sân.</p>
        )}
      </div>
    </div>
  );
};

export default ThanhToan;
