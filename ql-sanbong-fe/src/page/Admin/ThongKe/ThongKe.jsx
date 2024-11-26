import React, { useState, useEffect } from "react";
import "./ThongKe.scss";

const ThongKe = () => {
  const [dailyData, setDailyData] = useState([]); // Dữ liệu theo ngày
  const [monthlyData, setMonthlyData] = useState([]); // Dữ liệu theo tháng
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  const [selectedDate, setSelectedDate] = useState(""); // Giá trị ngày được chọn
  const [selectedMonth, setSelectedMonth] = useState(""); // Giá trị tháng được chọn

  // Gọi API theo ngày
  const fetchDailyData = async (date) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/san/ThongKe_day?ngay=${date}`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải thống kê theo ngày");
      }
      const data = await response.json();
      setDailyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API theo tháng
  const fetchMonthlyData = async (month) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/san/ThongKe_month?thang=${month}`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải thống kê theo tháng");
      }
      const data = await response.json();
      setMonthlyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn ngày
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedMonth(""); // Xóa giá trị tháng khi chọn ngày
    fetchDailyData(date); // Gọi API theo ngày
  };

  // Xử lý khi chọn tháng
  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    setSelectedDate(""); // Xóa giá trị ngày khi chọn tháng
    fetchMonthlyData(month); // Gọi API theo tháng
  };

  return (
    <div className="thong-ke">
      <h2>Thống kê doanh thu</h2>

      {/* Bộ lọc theo ngày và tháng */}
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="date">Chọn ngày:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="month">Chọn tháng:</label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Hiển thị dữ liệu theo ngày */}
      {selectedDate && dailyData.length > 0 && (
        <div className="statistics-section">
          <h3>Theo ngày</h3>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Tổng Tiền (VND)</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.ngay}</td>
                  <td>{item.tong_tien.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hiển thị dữ liệu theo tháng */}
      {selectedMonth && monthlyData.length > 0 && (
        <div className="statistics-section">
          <h3>Theo tháng</h3>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Tháng - Năm</th>
                <th>Tổng Tiền (VND)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.thang_nam}</td>
                  <td>{item.tong_tien.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hiển thị trạng thái loading và lỗi */}
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">Lỗi: {error}</p>}
    </div>
  );
};

export default ThongKe;
