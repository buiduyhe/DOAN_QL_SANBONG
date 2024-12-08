import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './LichSuDonDat.scss';

const LichSuDonDat = () => {
  const [lichSuDonDat, setLichSuDonDat] = useState([]);
  const [timeSlotCache, setTimeSlotCache] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState(0); // Default to "Đơn Đã Duyệt"

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
        return 'Chờ duyệt';
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

      const { ngay, batdau, ketthuc } = timeSlot;

      const start = new Date(`${ngay}T${batdau}`);
      const end = new Date(`${ngay}T${ketthuc}`);
      const durationMinutes = (end - start) / (1000 * 60);

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

  const filterDonDatByStatus = (status) => {
    return lichSuDonDat.filter((donDat) => donDat.status === status);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  return (
    <div className="lich-su-don-dat">
      <h1>Lịch Sử Đơn Đặt Hàng</h1>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange(0)}>Đơn Chờ Duyệt</button>
        <button onClick={() => handleFilterChange(1)}>Đơn Đã Duyệt</button>
        <button onClick={() => handleFilterChange(2)}>Đơn Bị Từ Chối</button>
        <button >Danh Sách Hóa Đơn</button>
      </div>
      <div className="list">
        {filterStatus === 0 && (
          <>
            <h2>Đơn Chờ Duyệt</h2>
            {filterDonDatByStatus(0).length === 0 ? (
              <p>Không có đơn đặt hàng nào chờ duyệt.</p>
            ) : (
              <ul>
                {filterDonDatByStatus(0).map((donDat, index) => (
                  <li key={index}>
                    <div className="stt">Thứ tự đơn đặt: {index + 1}</div>
                    <div>Ngày đặt: {new Date(donDat.created_at).toLocaleString()}</div>
                    <div>Sân đặt: {donDat.id_san}</div>
                    <div>Thời gian: {donDat.timeSlotText || 'Đang tải...'}</div>
                    <div>Thời lượng: {donDat.duration || 0} phút</div>
                    <div>Giá: {donDat.gia.toLocaleString()} VND</div>
                    <div>Trạng thái: {getStatusText(donDat.status)}</div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {filterStatus === 1 && (
          <>
            <h2>Đơn Đã Duyệt</h2>
            {filterDonDatByStatus(1).length === 0 ? (
              <p>Không có đơn đặt hàng nào đã được duyệt.</p>
            ) : (
              <ul>
                {filterDonDatByStatus(1).map((donDat, index) => (
                  <li key={index}>
                    <div className="stt">Thứ tự đơn đặt: {index + 1}</div>
                    <div>Ngày đặt: {new Date(donDat.created_at).toLocaleString()}</div>
                    <div>Sân đặt: {donDat.id_san}</div>
                    <div>Thời gian: {donDat.timeSlotText || 'Đang tải...'}</div>
                    <div>Thời lượng: {donDat.duration || 0} phút</div>
                    <div>Giá: {donDat.gia.toLocaleString()} VND</div>
                    <div>Trạng thái: {getStatusText(donDat.status)}</div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {filterStatus === 2 && (
          <>
            <h2>Đơn Bị Từ Chối</h2>
            {filterDonDatByStatus(2).length === 0 ? (
              <p>Không có đơn đặt hàng nào bị từ chối.</p>
            ) : (
              <ul>
                {filterDonDatByStatus(2).map((donDat, index) => (
                  <li key={index}>
                    <div className="stt">Thứ tự đơn đặt: {index + 1}</div>
                    <div>Ngày đặt: {new Date(donDat.created_at).toLocaleString()}</div>
                    <div>Sân đặt: {donDat.id_san}</div>
                    <div>Thời gian: {donDat.timeSlotText || 'Đang tải...'}</div>
                    <div>Thời lượng: {donDat.duration || 0} phút</div>
                    <div>Giá: {donDat.gia.toLocaleString()} VND</div>
                    <div>Trạng thái: {getStatusText(donDat.status)}</div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LichSuDonDat;