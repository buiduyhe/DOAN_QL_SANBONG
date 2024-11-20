import React, { useEffect, useState } from "react";
import "../QL.scss";

const QLDonDat = () => {
  const [hoaDons, setHoaDons] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/san/get_ds_hoadon')
      .then(response => response.json())
      .then(data => setHoaDons(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h4>Quản lý Đơn Đặt</h4>
      <table>
        <thead>
          <tr>
            <th>Mã Đơn</th>
            <th>ID người đặt</th>
            <th>Ngày Tạo</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          {hoaDons.map(hoaDon => (
            <tr key={hoaDon.id}>
              <td>{hoaDon.ma_hoa_don}</td>
              <td>{hoaDon.id_user}</td>
              <td>{new Date(hoaDon.ngay_tao).toLocaleDateString()}</td>
              <td>{hoaDon.trang_thai === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</td>
              <td>{hoaDon.tong_tien}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDonDat;
