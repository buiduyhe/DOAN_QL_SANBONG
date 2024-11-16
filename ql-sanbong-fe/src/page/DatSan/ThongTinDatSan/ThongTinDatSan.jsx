import React, { useState, useEffect } from 'react';
import './ThongTinDatSan.scss';
import placeholderImage from '../../../assets/DatSan/SanBanh5.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ThongTinDatSan = ({ selectedField }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, timeSlot } = location.state || {};
  const [fields, setFields] = useState([]); // State to store field data
  const [loaiSanData, setLoaiSanData] = useState([]); // State to store loai_san data from API

  const defaultDate = selectedDate || new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

  useEffect(() => {
    // Fetch loại sân data
    fetch('http://127.0.0.1:8000/san/loai_san')
      .then((response) => response.json())
      .then((data) => setLoaiSanData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!selectedField) return <div className="thong-tin-dat-san">Chọn sân để xem thông tin</div>;

  const { loai_san_id, id, gia_thue } = selectedField;

  // Tìm mô tả loại sân dựa vào loai_san_id
  const loaiSanDescription = loaiSanData.find((loaiSan) => loaiSan.id === loai_san_id)?.mo_ta || "Không có mô tả";

   // Tìm tên loại sân dựa vào loai_san_id
  const loaiSanName = loaiSanData.find((loaiSan) => loaiSan.id === loai_san_id)?.ten_loai_san || "Không rõ";
  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleXacNhan = () => {
    const accessToken = Cookies.get('access_token');

    if (!accessToken) {
      // Nếu chưa đăng nhập, hiển thị thông báo và chuyển hướng đến trang đăng nhập
      alert('Bạn cần đăng nhập để tiếp tục đặt sân.');
      navigate('/login');
      return;
    }

    // Điều hướng đến trang ThanhToan và truyền thông tin đặt sân
    navigate('/thanh-toan', { state: { selectedField, selectedDate: defaultDate, timeSlot, currentStep: 3,loaiSanDescription,loaiSanName } });
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
          <p>Tổng cộng:  </p>
          <p><strong>{gia_thue?.toLocaleString('vi-VN')} VND</strong></p>
        </div>
        <button className="pay-button" onClick={handleXacNhan}>Xác Nhận</button>
      </div>
    </div>
  );
};

export default ThongTinDatSan;
