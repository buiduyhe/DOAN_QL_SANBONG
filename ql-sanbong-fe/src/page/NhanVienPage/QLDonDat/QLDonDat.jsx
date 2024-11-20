import React, { useEffect, useState } from "react";
import "../QL.scss";

const QLDonDat = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/san/get_ds_hoadon')
      .then(response => response.json())
      .then(data => setHoaDons(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleRowClick = (ma_hoa_don) => {
    setSelectedId(ma_hoa_don);
  };

  return (
    <div>
      <h4>Quản lý Đơn Đặt</h4>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Mã Đơn</th>
            <th>Tên người đặt</th>
            <th>Ngày Tạo</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          {hoaDons.map(hoaDon => (
            <tr key={hoaDon.id} onClick={() => handleRowClick(hoaDon.id)}>
              <td>
                <input
                  type="radio"
                  name="hoadon"
                  onChange={() => handleRowClick(hoaDon.id)}
                  checked={selectedId === hoaDon.id}
                  onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện onClick của <tr>
                />
              </td>
              <td>{hoaDon.ma_hoa_don}</td>
              <td>{hoaDon.ten_nguoi_dat}</td>
              <td>{new Date(hoaDon.ngay_tao).toLocaleDateString()}</td>
              <td>{hoaDon.trangthai === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</td>
              <td>{hoaDon.tongtien}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDonDat;
