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
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc

  // Hàm định dạng số tiền
  const formatCurrency = (value) => {
    return value
      .toLocaleString("vi-VN", { maximumFractionDigits: 0 })
      .replace(/,/g, ".");
  };

  // Hàm tạo danh sách các ngày từ startDate đến endDate
  const generateDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDateObj = new Date(end);

    while (currentDate <= endDateObj) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Gọi API theo khoảng thời gian
  const fetchDailyData = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8000/san/ThongKe_day?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải thống kê theo ngày");
      }

      const data = await response.json();

      // Tạo dữ liệu cho các ngày không có doanh thu (giả sử giá trị = 0)
      const allDates = generateDateRange(startDate, endDate);
      const completeData = allDates.map((ngay) => {
        const existingData = data.find((item) => item.ngay === ngay);
        return existingData || { ngay, tong_tien: 0 };
      });

      setDailyData(completeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn ngày bắt đầu
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  // Xử lý khi chọn ngày kết thúc
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Gọi API khi startDate và endDate thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      fetchDailyData();
    }
  }, [startDate, endDate]);

  // Tính toán ngày tối đa và tối thiểu cho input date
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const minDate = new Date(today.setDate(today.getDate() - 29)).toISOString().split("T")[0];

  return (
    <div className="thong-ke">
      <h2>Thống kê doanh thu</h2>

      {/* Bộ lọc khoảng thời gian */}
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="start-date">Từ ngày:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            min={minDate}
            max={maxDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="end-date">Đến ngày:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            min={startDate || minDate}
            max={maxDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Hiển thị dữ liệu theo ngày */}
      {dailyData.length > 0 && (
        <div className="statistics-section">
          <h3>Thống kê doanh thu từ {startDate} đến {endDate}</h3>
          <ResponsiveContainer width="95%" height={400}>
            <BarChart data={dailyData} margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
              <XAxis dataKey="ngay" />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tickMargin={10}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Tổng tiền"]}
              />
              <Legend />
              <Bar dataKey="tong_tien" fill="#8884d8" barSize={30} name="Tổng tiền" />
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
