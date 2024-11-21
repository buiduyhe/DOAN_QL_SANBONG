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
  const { id, gia_thue } = selectedField || {};
  const [isSuccess, setIsSuccess] = useState(false);

  // Lấy user_id từ cookie
  const user_id = Cookies.get('user_id');

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
    const formattedCheckoutDate = format(checkoutDate, 'YYYY-MM-DD', { timeZone: 'Asia/Ho_Chi_Minh' });
    return formattedCheckoutDate;
  };
  const formattedSelectedDate = format(new Date(selectedDate), 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
  const getTimeslotId = async () => {
    const [start_time] = timeSlot.split(' - ');
    const requestData = {
      san_id: id,
      ngay_dat: formattedSelectedDate,
      batdau: start_time
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/san/get_id_timeslot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        return data.id;
      } else {
        console.log("Failed Response:", await response.text());
        alert('Không thể lấy timeslot_id, vui lòng thử lại.');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi lấy timeslot_id, vui lòng thử lại sau.');
      return null;
    }
  };

  const handleDatSan = async () => {
    if (!id) return;

    // Kiểm tra xem selectedDate có hợp lệ không
    if (!selectedDate) {
      alert('Ngày không hợp lệ!');
      return;
    }

    // Lấy timeslot_id từ API
    const timeslot_id = await getTimeslotId();
    if (!timeslot_id) return;

    // Tách start_time và end_time từ timeSlot
    const [start_time, end_time] = timeSlot.split(' - ');

    // Tạo đối tượng dữ liệu gửi API
    const data = {
      user_id,
      san_id: id,
      timeslot_id,
      gia: gia_thue
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/san/dat_san`, {
        method: 'POST', // Sử dụng PUT để cập nhật dữ liệu
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        console.log("Success:", await response.json()); // In phản hồi từ API khi cập nhật thành công
        alert('Đặt sân thành công!');
        window.location.href = '/datsan'; // Chuyển hướng về trang /datsan
      } else {
        console.log("Failed Response:", await response.text()); // In lỗi nếu có
        alert('Đặt sân không thành công, vui lòng thử lại.'+data.timeslot_id +data.gia +data.user_id);
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
            <p>Loại sân: <strong>{loaiSanName} - {id}</strong></p>
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
