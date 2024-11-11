import React from "react";
import "../QL.scss";
const QLKhachHang = () => {
  return (
    <div>
      <h4>Quản lý khách hàng</h4>
      <table>
        <thead>
          <tr>
            <th>Mã Khách Hàng</th>
            <th>Tên Khách Hàng</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Giới Tính</th>
          </tr>
        </thead>
        <tbody>{/* them du lieu tu api */}</tbody>
      </table>
    </div>
  );
};

export default QLKhachHang;
