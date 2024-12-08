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
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const [startYear, setStartYear] = useState(""); 
  const [endYear, setEndYear] = useState(""); 

  // Hàm định dạng số tiền
  const formatCurrency = (value) => {
    return value
      .toLocaleString("vi-VN", { maximumFractionDigits: 0 })
      .replace(/,/g, ".");
  };

  // Gọi API theo khoảng thời gian
  const fetchYearlyData = async () => {
    if (!startYear || !endYear) return;
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch(
        `http://localhost:8000/san/ThongKe_year?startYear=${startYear}&endYear=${endYear}`
      );
  
      if (!response.ok) {
        throw new Error("Lỗi khi tải thống kê theo năm");
      }
  
      const data = await response.json();

      const allYears = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
      );
      const completeData = allYears.map((nam) => {
        const existingData = data.find((item) => Number(item.nam) === nam);
        return existingData || { nam, tong_tien: 0 };
      });
  
      setYearlyData(completeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartYearChange = (e) => {
    setStartYear(Number(e.target.value));
  };

  const handleEndYearChange = (e) => {
    setEndYear(Number(e.target.value));
  };
  useEffect(() => {
    if (startYear && endYear) {
      fetchYearlyData();
    }
  }, [startYear, endYear]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const minYear = currentYear - 10;

  return (
    <div className="thong-ke">
      <h2>Thống kê doanh thu theo năm</h2>

      {/* Bộ lọc khoảng thời gian */}
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="start-year">Từ năm:</label>
          <input
            type="number"
            id="start-year"
            value={startYear}
            min={minYear}
            max={currentYear}
            onChange={handleStartYearChange}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="end-year">Đến năm:</label>
          <input
            type="number"
            id="end-year"
            value={endYear}
            min={startYear || minYear}
            max={currentYear}
            onChange={handleEndYearChange}
          />
        </div>
      </div>

      {/* Hiển thị dữ liệu theo năm */}
      {yearlyData.length > 0 && (
        <div className="statistics-section">
          <h3>Thống kê doanh thu từ năm {startYear} đến năm {endYear}</h3>
          <ResponsiveContainer width="95%" height={400}>
            <BarChart data={yearlyData} margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
              <XAxis dataKey="nam" />
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
