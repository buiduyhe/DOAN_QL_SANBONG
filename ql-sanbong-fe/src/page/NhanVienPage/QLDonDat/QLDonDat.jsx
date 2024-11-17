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
            <th>Mã Nhân Viên</th>
            <th>Mã Khách Hàng</th>
            <th>Ngày Tạo</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
            <th>Hình Thức Thanh Toán</th>
          </tr>
        </thead>
        <tbody>{/* them du lieu tu api */}</tbody>
      </table>
    </div>
  );
};

export default QLDonDat;
