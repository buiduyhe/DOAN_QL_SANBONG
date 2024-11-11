import React from "react";
import "../QL.scss";
const QLDichVu = () => {
  return (
    <div>
      <h4>Quản lý Dịch Vụ</h4>
      <table>
        <thead>
          <tr>
            <th>Mã Dịch Vụ</th>
            <th>Tên Dịch Vụ</th>
            <th>Loại Dịch Vụ</th>
            <th>Giá</th>
            <th>Số Lượng</th>
          </tr>
        </thead>
        <tbody>{/* them du lieu tu api */}</tbody>
      </table>
    </div>
  );
};

export default QLDichVu;
