import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './LichSuDonDat.scss';

const LichSuDonDat = () => {
  const [lichSuDonDat, setLichSuDonDat] = useState([]);
  const [timeSlotCache, setTimeSlotCache] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('access_token');
      if (!token) {
        alert('Bạn cần đăng nhập để xem lịch sử.');
        window.location.href = '/login';
        return;
      }

      try {
        const responseDonDat = await axios.get('http://localhost:8000/san/get_ds_dat_san_by_user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLichSuDonDat(responseDonDat.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        if (error.response && error.response.status === 401) {
          alert('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
          Cookies.remove('access_token');
          window.location.href = '/login';
        } else {
          setError('Không thể tải dữ liệu');
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Chưa thanh toán';
      case 1:
        return 'Đã duyệt';
      case 2:
        return 'Từ chối';
      default:
        return 'Không xác định';
    }
  };

  const getTimeSlotText = async (timeslotId) => {
    if (timeSlotCache[timeslotId]) {
      return timeSlotCache[timeslotId];
    }

    try {
      const response = await axios.get(`http://localhost:8000/san/get_timeslot_by_id/${timeslotId}`);
      const timeSlot = response.data;

      // Lấy ngày (ngay), bắt đầu (batdau) và kết thúc (ketthuc)
      const { ngay, batdau, ketthuc } = timeSlot;

      // Tính số phút
      const start = new Date(`${ngay}T${batdau}`);
      const end = new Date(`${ngay}T${ketthuc}`);
      const durationMinutes = (end - start) / (1000 * 60);

      // Định dạng thời gian và ngày
      const date = new Date(start).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const timeSlotText = {
        text: `${date}, ${batdau} - ${ketthuc}`,
        duration: durationMinutes,
      };

      // Lưu cache
      setTimeSlotCache((prevCache) => ({
        ...prevCache,
        [timeslotId]: timeSlotText,
      }));

      return timeSlotText;
    } catch (error) {
      console.error('Lỗi khi lấy timeslot:', error);
      return { text: 'Không xác định', duration: 0 };
    }
  };

  const renderLichSuDonDat = async () => {
    const updatedLichSuDonDat = await Promise.all(lichSuDonDat.map(async (donDat, index) => {
      const timeSlotInfo = await getTimeSlotText(donDat.timeslot_id);
      return { ...donDat, timeSlotText: timeSlotInfo.text, duration: timeSlotInfo.duration };
    }));

    setLichSuDonDat(updatedLichSuDonDat);
  };

  useEffect(() => {
    if (!isLoading) {
      renderLichSuDonDat();
    }
  }, [isLoading]);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="lich-su-don-dat">
      <h1>Lịch Sử Đơn Đặt Hàng</h1>
      <div className="list">
        {lichSuDonDat.length === 0 ? (
          <p>Bạn chưa có đơn đặt hàng nào.</p>
        ) : (
          <ul>
            {lichSuDonDat.map((donDat, index) => (
              <li key={index}>
                <div className="stt">Thứ tự đơn đặt: {index + 1}</div>
                <div>Ngày đặt: {new Date(donDat.created_at).toLocaleString()}</div>
                <div>Trạng thái: {getStatusText(donDat.status)}</div>
                <div>Sân đặt: {donDat.id_san}</div>
                <div>Thời gian: {donDat.timeSlotText || 'Đang tải...'}</div>
                <div>Thời lượng: {donDat.duration || 0} phút</div>
                <div>Giá: {donDat.gia.toLocaleString()} VND</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LichSuDonDat;
