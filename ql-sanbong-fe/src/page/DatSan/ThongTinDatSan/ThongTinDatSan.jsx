import React from 'react';
import './ThongTinDatSan.scss';
import placeholderImage from '../../../assets/DatSan/SanBanh5.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const ThongTinDatSan = ({ selectedField }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, timeSlot } = location.state || {};

  if (!selectedField) return <div className="thong-tin-dat-san">Chọn sân để xem thông tin</div>;

  const { LoaiSan, id, Gia } = selectedField;

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleXacNhan = () => {
    // Điều hướng đến trang ThanhToan và truyền thông tin đặt sân
    navigate('/thanh-toan', { state: { selectedField, selectedDate, timeSlot, currentStep: 3 } });
  };

  return (
    <div className="thong-tin-dat-san">
      <img src={placeholderImage} alt="Sân bóng" className="field-image" />
      <div className="field-info">
        <p>{LoaiSan === "San 7" ? "Sân bóng đá 7 người" : "Sân bóng mini 5 người"}</p>
        <p>Loại sân: <strong>{LoaiSan} - {id}</strong></p>
        <p>Ngày đặt: <strong>{formatDate(selectedDate)}</strong></p>
        <p>Thời gian: <strong>{timeSlot || '--'}</strong></p>
        <div className="total-amount">
          <p>Tổng cộng: </p>
          <p><strong>{Gia?.toLocaleString('vi-VN')} VND</strong></p>
        </div>
        <button className="pay-button" onClick={handleXacNhan}>Xác Nhận</button>
      </div>
    </div>
  );
};

export default ThongTinDatSan;
