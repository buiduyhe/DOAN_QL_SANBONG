import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ThongKe.scss";

const ThongKe = () => {
  const [dailyData, setDailyData] = useState([]); // Dữ liệu theo ngày
  const [monthlyData, setMonthlyData] = useState([]); // Dữ liệu theo tháng
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  const [selectedDate, setSelectedDate] = useState(""); // Giá trị ngày được chọn
  const [selectedMonth, setSelectedMonth] = useState(""); // Giá trị tháng được chọn

  // Lọc 3 ngày gần nhất (tính từ ngày người dùng chọn)
  const getRecentDates = (date) => {
    const dates = [];
    const currentDate = new Date(date);

    // Lấy ngày hiện tại và 2 ngày trước đó
    for (let i = 2; i >= 0; i--) {
      const dateCopy = new Date(currentDate);
      dateCopy.setDate(currentDate.getDate() - i);
      dates.push(dateCopy.toISOString().split("T")[0]);
    }

    return dates;
  };

  // Lọc 3 tháng gần nhất (tính từ tháng người dùng chọn)
  const getRecentMonths = (month) => {
    const months = [];
    const [year, monthNum] = month.split("-");

    // Lấy tháng hiện tại và 2 tháng trước đó
    for (let i = 2; i >= 0; i--) {
      const currentMonth = new Date(year, monthNum - 1 - i, 1);
      months.push(
        `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`
      );
    }

    return months;
  };

  // Gọi API theo ngày
  const fetchDailyData = async (date) => {
    try {
      setLoading(true);
      const recentDates = getRecentDates(date).join(",");
      const response = await fetch(
        `http://localhost:8000/san/ThongKe_day?ngay=${recentDates}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tải thống kê theo ngày");
      }
      const data = await response.json();
  
      // Tạo dữ liệu cho các ngày không có doanh thu (giả sử giá trị = 0)
      const recentDatesArray = getRecentDates(date);
      const completeData = recentDatesArray.map((ngay) => {
        const existingData = data.find((item) => item.ngay === ngay);
        return existingData || { ngay, tong_tien: 0 }; // Nếu không có dữ liệu cho ngày, gán tổng tiền = 0
      });
  
      setDailyData(completeData); // Lưu trữ dữ liệu trả về từ API, bao gồm cả ngày không có doanh thu
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
      const recentMonths = getRecentMonths(month).join(",");
      const response = await fetch(
        `http://localhost:8000/san/ThongKe_month?thang=${recentMonths}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tải thống kê theo tháng");
      }
      const data = await response.json();
  
      // Tạo dữ liệu cho các tháng không có doanh thu (giả sử giá trị = 0)
      const recentMonthsArray = getRecentMonths(month);
      const completeData = recentMonthsArray.map((thang) => {
        const existingData = data.find((item) => item.thang_nam === thang);
        return existingData || { thang_nam: thang, tong_tien: 0 }; // Nếu không có dữ liệu cho tháng, gán tổng tiền = 0
      });
  
      setMonthlyData(completeData); // Lưu trữ dữ liệu trả về từ API, bao gồm cả tháng không có doanh thu
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
          <h3>Thống kê doanh thu theo ngày</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dailyData}>
              <XAxis dataKey="ngay" label={{ position: "insideBottom" }} />
              <YAxis label={{ angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="tong_tien"
                fill="#8884d8"
                name="Tổng Tiền (VND)"
                barSize={20} // Điều chỉnh kích thước cột
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hiển thị dữ liệu theo tháng */}
      {selectedMonth && monthlyData.length > 0 && (
        <div className="statistics-section">
          <h3>Thống kê doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="thang_nam" label={{ position: "insideBottom" }} />
              <YAxis label={{ angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="tong_tien"
                fill="#82ca9d"
                name="Tổng Tiền (VND)"
                barSize={30} // Điều chỉnh kích thước cột theo tháng
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hiển thị trạng thái loading và lỗi */}
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">Lỗi: {error}</p>}
    </div>
  );
};

export default ThongKe;
