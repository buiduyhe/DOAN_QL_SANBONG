import React from 'react';
import './ThongTinDatSan.scss';
import placeholderImage from '../../../assets/DatSan/SanBong.jpg'; // Đảm bảo có ảnh sân phù hợp
import { useLocation } from 'react-router-dom';  // Import useLocation từ react-router-dom

const ThongTinDatSan = ({ selectedField }) => {
  const location = useLocation();  // Lấy location từ useLocation hook
  const { selectedDate, timeSlot } = location.state || {};  // Lấy selectedDate và timeSlot từ location.state

  if (!selectedField) return <div className="thong-tin-dat-san">Chọn sân để xem thông tin</div>;

  const { LoaiSan, id, Gia } = selectedField;

  // Format ngày đã chọn từ DatePicker
  const formatDate = (date) => {
    if (!date) return '--';  // Nếu không có ngày, trả về dấu gạch ngang
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="thong-tin-dat-san">
      <img src={placeholderImage} alt="Sân bóng" className="field-image" />
      <div className="field-info">
        <p>Sân bóng mini 5 người</p>
        <p>Loại sân: <strong>{LoaiSan} - {id}</strong></p>
        <p>Ngày đặt: <strong>{formatDate(selectedDate)}</strong></p> {/* Hiển thị ngày đã chọn */}
        <p>Thời gian: <strong>{timeSlot || '--'}</strong></p> {/* Hiển thị thời gian đã chọn */}
        <div className="total-amount">
          <p>Tổng cộng: </p>
          <p><strong>{Gia?.toLocaleString('vi-VN')} VND</strong></p> {/* Hiển thị giá từ API */}
        </div>
        <button className="pay-button">Thanh Toán</button>
      </div>
    </div>
  );
};

export default ThongTinDatSan;
