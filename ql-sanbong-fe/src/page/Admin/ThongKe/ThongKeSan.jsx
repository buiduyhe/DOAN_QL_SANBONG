import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ThongKe.scss"

const ThongKeSan = () => {
  const [thongKeData, setThongKeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchSanId, setSearchSanId] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://doan-ql-sanbong.onrender.com/san/ThongKe_San');
        setThongKeData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError('Không thể lấy dữ liệu từ API');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = thongKeData.filter((item) => {
      const matchDate = searchDate ? item.ngay.includes(searchDate) : true;
      const matchSanId = searchSanId ? item.san_id.toString().includes(searchSanId) : true;
      return matchDate && matchSanId;
    });
    setFilteredData(filterData);
  }, [searchDate, searchSanId, thongKeData]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="thong-ke">
      <h2>Thống Kê Sân</h2>
      <div className="filters">
        <div className="filter-item">
          <label>Tìm theo ngày:</label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Tìm theo Sân ID:</label>
          <input
            type="text"
            placeholder="Nhập Sân ID"
            value={searchSanId}
            onChange={(e) => setSearchSanId(e.target.value)}
          />
        </div>
      </div>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Sân ID</th>
            <th>Tổng Số Lần</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.ngay}</td>
              <td>{item.san_id}</td>
              <td>{item.tong_so_lan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThongKeSan;
