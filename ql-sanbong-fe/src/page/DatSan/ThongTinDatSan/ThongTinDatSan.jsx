import React, { useState, useEffect } from 'react';
import './ThongTinDatSan.scss';
import placeholderImage from '../../../assets/DatSan/SanBanh5.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ThongTinDatSan = ({ selectedField }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, timeSlot } = location.state || {};
  const [fields, setFields] = useState([]);
  const [loaiSanData, setLoaiSanData] = useState([]);

  const defaultDate = selectedDate || new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/san/loai_san')
      .then((response) => response.json())
      .then((data) => setLoaiSanData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!selectedField) return <div className="thong-tin-dat-san">Chọn sân để xem thông tin</div>;

  const { loai_san_id, id, gia_thue } = selectedField;

  const loaiSanDescription = loaiSanData.find((loaiSan) => loaiSan.id === loai_san_id)?.mo_ta || "Không có mô tả";
  const loaiSanName = loaiSanData.find((loaiSan) => loaiSan.id === loai_san_id)?.ten_loai_san || "Không rõ";

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculatePrice = (basePrice, timeSlot) => {
    if (!timeSlot) return basePrice;

    const [startHour, startMinute] = timeSlot.split(':').map(Number);
    const startTime = startHour * 60 + startMinute; // Convert to minutes for easier comparison

    const morningThreshold = 6 * 60 + 30; // 6:30 AM in minutes
    const eveningThreshold = 16 * 60 +30 ; // 4:30 PM in minutes

    if (startTime < morningThreshold || startTime > eveningThreshold) {
      return basePrice * 1.1; // Add 10% if outside 6:30 AM to 6:30 PM
    }
    return basePrice;
  };

  const adjustedPrice = calculatePrice(gia_thue, timeSlot);

  const handleXacNhan = () => {
    const accessToken = Cookies.get('access_token');
  
    if (!accessToken) {
      alert('Bạn cần đăng nhập để tiếp tục đặt sân.');
      navigate('/login');
      return;
    }
  
    const [start_time] = timeSlot?.split(' - ') || [];
    const startHour = parseInt(start_time.split(':')[0], 10);
    const startMinute = parseInt(start_time.split(':')[1], 10);
  
    // Check if time is before 6:30 or after 18:30
    const isExtraFeeTime = startHour < 6 || (startHour === 6 && startMinute < 30) || startHour >= 16;
    const adjustedPrice = isExtraFeeTime ? gia_thue * 1.1 : gia_thue;
  
    navigate('/thanh-toan', {
      state: {
        selectedField: { ...selectedField, gia_thue: adjustedPrice },
        selectedDate: defaultDate,
        timeSlot,
        currentStep: 3,
        loaiSanDescription,
        loaiSanName,
      },
    });
  };
  

  return (
    <div className="thong-tin-dat-san">
      <img src={placeholderImage} alt="Sân bóng" className="field-image" />
      <div className="field-info">
        <p>{loaiSanDescription}</p>
        <p>Loại sân: <strong>{loaiSanName} - {id}</strong></p>
        <p>Ngày đặt: <strong>{formatDate(defaultDate)}</strong></p>
        <p>Thời gian: <strong>{timeSlot || '--'}</strong></p>
        <div className="total-amount">
          <p>Tổng cộng: </p>
          <p><strong>{adjustedPrice?.toLocaleString('vi-VN')} VND</strong></p>
        </div>
        <button className="pay-button" onClick={handleXacNhan}>Xác Nhận</button>
      </div>
    </div>
  );
};

export default ThongTinDatSan;
