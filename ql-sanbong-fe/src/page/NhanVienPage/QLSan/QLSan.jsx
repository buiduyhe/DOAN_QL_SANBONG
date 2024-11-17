import React from "react";
import "../QL.scss";

const QLSan = () => {
  return (
    <div>
      <h4>Quản lý Sân Bóng</h4>
      <table>
        <thead>
          <tr>
            <th>Mã Sân Bóng</th>
            <th>Loại Sân</th>
            <th>Tình Trạng</th>
          </tr>
        </thead>
        <tbody>{/* them du lieu tu api */}</tbody>
      </table>
    </div>
  );
};

export default QLSan;
