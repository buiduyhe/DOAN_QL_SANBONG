import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QLPhieuNhap = () => {
  const [phieuNhapList, setPhieuNhapList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Danh sách ID để gọi API
    const ids = [1, 2, 3, 4]; // Thay thế bằng danh sách ID thực tế

    // Hàm lấy dữ liệu từ API với tất cả các ID
    const fetchAllPhieuNhap = async () => {
      try {
        const requests = ids.map((id) =>
          axios.get(`http://localhost:8000/Ncc/nhap-hang/${id}`)
        );
        const responses = await Promise.all(requests); // Gửi tất cả yêu cầu
        const data = responses.map((response) => response.data.phieu_nhap); // Trích xuất dữ liệu
        setPhieuNhapList(data.flat()); // Gộp dữ liệu từ tất cả các response
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu từ API!');
        setLoading(false);
      }
    };

    fetchAllPhieuNhap();
  }, []);

  // Render trạng thái Loading/Error/Data
  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Danh sách phiếu nhập</h1>
      <ul>
        {phieuNhapList.map((phieu) => (
          <li key={phieu.id}>
            <p><strong>Mã phiếu nhập:</strong> {phieu.ma_phieu_nhap}</p>
            <p><strong>Ngày nhập:</strong> {new Date(phieu.ngay_nhap).toLocaleString()}</p>
            <p><strong>Tổng tiền:</strong> {phieu.tong_tien.toLocaleString()} VND</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QLPhieuNhap;
