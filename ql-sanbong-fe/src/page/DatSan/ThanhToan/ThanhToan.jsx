import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../../component/Navbar/Navbar';
import Stepper from '../Stepper/Stepper';
import { format } from 'date-fns-tz'; // Thư viện date-fns-tz
import { addMinutes } from 'date-fns'; // Thư viện date-fns để cộng phút
import './ThanhToan.scss';
import Cookies from 'js-cookie';

const ThanhToan = () => {
  const location = useLocation();
  const { selectedField, selectedDate, timeSlot, loaiSanDescription, loaiSanName } = location.state || {};
  const { san_id, gia_thue } = selectedField || {};
  const [isSuccess, setIsSuccess] = useState(false);

  const user_id = Cookies.get("user_id");

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Hàm để chuyển đổi thời gian sang múi giờ Việt Nam
  const formatDateInVN = (date) => {
    const vietnamTime = format(new Date(date), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Ho_Chi_Minh' });
    return vietnamTime;
  };

  // Tính toán thời gian checkout (GioCheckout) và chuyển đổi sang múi giờ Việt Nam
  const calculateCheckoutTime = (selectedDate) => {
    // Chuyển selectedDate thành đối tượng Date nếu cần thiết
    const selectedDateObj = new Date(selectedDate);
    
    // Nếu selectedDate không hợp lệ, trả về lỗi
    if (isNaN(selectedDateObj)) {
      alert('Ngày không hợp lệ');
      return;
    }

    // Sử dụng date-fns addMinutes để cộng 90 phút vào thời gian checkout
    const checkoutDate = addMinutes(selectedDateObj, 90);
    
    // Chuyển checkoutDate sang múi giờ Việt Nam
    const formattedCheckoutDate = format(checkoutDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Ho_Chi_Minh' });
    return formattedCheckoutDate;
  };

  const handleDatSan = async () => {
    if (!san_id) return;

    // Kiểm tra xem selectedDate có hợp lệ không
    if (!selectedDate) {
      alert('Ngày không hợp lệ!');
      return;
    }

    // Tách start_time và end_time từ timeSlot
    const [start_time, end_time] = timeSlot.split(' - ');

    // Tạo đối tượng dữ liệu gửi API
    const data = {
      user_id,
      san_id,
      selectedDate,
      start_time, // Sử dụng thời gian đã chuyển đổi
      end_time, // Thời gian checkout đã được tính toán và chuyển đổi
      trang_thai: '1',
    };

    try {
      const response = await fetch(`https://672b14c2976a834dd0258200.mockapi.io/DatSan/${san_id}`, {
        method: 'PUT', // Sử dụng PUT để cập nhật dữ liệu
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        console.log("Success:", await response.json()); // In phản hồi từ API khi cập nhật thành công
      } else {
        console.log("Failed Response:", await response.text()); // In lỗi nếu có
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
            <p>{loaiSanDescription}</p>
            <p>Loại sân: <strong>{loaiSanName} - {san_id}</strong></p>
            <p>Ngày đặt: <strong>{formatDate(selectedDate)}</strong></p>
            <p>Thời gian: <strong>{timeSlot || '--'}</strong></p>
            <div className="total-amount">
              <p>Tổng cộng: </p>
              <p><strong>{gia_thue?.toLocaleString('vi-VN')} VND</strong></p>
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
