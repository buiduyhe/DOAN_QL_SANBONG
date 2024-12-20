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
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const [startMonth, setStartMonth] = useState(""); 
  const [endMonth, setEndMonth] = useState(""); 

  // Hàm định dạng số tiền
  const formatCurrency = (value) => {
    return value
      .toLocaleString("vi-VN", { maximumFractionDigits: 0 })
      .replace(/,/g, ".");
  };

  // Hàm tạo danh sách các tháng từ startMonth đến endMonth
  const generateMonthRange = (start, end) => {
    const months = [];
    const startDate = new Date(start + "-01");
    const endDate = new Date(end + "-01");

    while (startDate <= endDate) {
      const month = startDate.toISOString().slice(0, 7); // Lấy định dạng YYYY-MM
      months.push(month);
      startDate.setMonth(startDate.getMonth() + 1); // Tăng 1 tháng
    }

    return months;
  };

  // Gọi API theo khoảng thời gian các tháng
  const fetchMonthlyData = async () => {
    if (!startMonth || !endMonth) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://doan-ql-sanbong.onrender.com/san/ThongKe_month?startMonth=${startMonth}&endMonth=${endMonth}`
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải thống kê theo tháng");
      }

      const data = await response.json();

      // Tạo dữ liệu cho các tháng không có doanh thu (giả sử giá trị = 0)
      const allMonths = generateMonthRange(startMonth, endMonth);
      const completeData = allMonths.map((month) => {
        const existingData = data.find((item) => item.thang_nam === month);
        return existingData || { thang_nam: month, tong_tien: 0 };
      });

      setMonthlyData(completeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn tháng bắt đầu
  const handleStartMonthChange = (e) => {
    setStartMonth(e.target.value);
  };

  // Xử lý khi chọn tháng kết thúc
  const handleEndMonthChange = (e) => {
    setEndMonth(e.target.value);
  };

  // Gọi API khi startMonth và endMonth thay đổi
  useEffect(() => {
    if (startMonth && endMonth) {
      fetchMonthlyData();
    }
  }, [startMonth, endMonth]);

  // Tính toán tháng tối đa và tối thiểu cho input month
  const today = new Date();
  const maxMonth = today.toISOString().slice(0, 7); // Lấy định dạng YYYY-MM
  const minMonth = new Date(today.setMonth(today.getMonth() - 11))
    .toISOString()
    .slice(0, 7); // Giới hạn 12 tháng

  return (
    <div className="thong-ke">
      <h2>Thống kê doanh thu theo tháng</h2>

      {/* Bộ lọc khoảng thời gian */}
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="start-month">Từ tháng:</label>
          <input
            type="month"
            id="start-month"
            value={startMonth}
            min={minMonth}
            max={maxMonth}
            onChange={handleStartMonthChange}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="end-month">Đến tháng:</label>
          <input
            type="month"
            id="end-month"
            value={endMonth}
            min={startMonth || minMonth}
            max={maxMonth}
            onChange={handleEndMonthChange}
          />
        </div>
      </div>

      {/* Hiển thị dữ liệu theo tháng */}
      {monthlyData.length > 0 && (
        <div className="statistics-section">
          <h3>Thống kê doanh thu từ {startMonth} đến {endMonth}</h3>
          <ResponsiveContainer width="95%" height={400}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
              <XAxis dataKey="thang_nam" />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tickMargin={10}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Tổng tiền"]}
              />
              <Legend />
              <Bar dataKey="tong_tien" fill="#82ca9d" barSize={30} name="Tổng tiền" />
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
