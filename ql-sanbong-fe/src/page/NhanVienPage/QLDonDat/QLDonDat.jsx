import React from "react";
import "../QL.scss";
const QLDonDat = () => {
  return (
    <div>
      <h4>Quản lý Đơn Đặt</h4>
      <table>
        <thead>
          <tr>
            <th>Mã Đơn</th>
            <th>Tên Khách Hàng</th>
            <th>Tên Nhân Viên Lập</th>
            <th>Ngày Đặt</th>
            <th>Giờ Đặt</th>
            <th>Giờ Kết Thúc</th>
          </tr>
        </thead>
        <tbody>{/* them du lieu tu api */}</tbody>
      </table>
    </div>
  );
};

export default QLDonDat;
