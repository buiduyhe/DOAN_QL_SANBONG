import React, { useEffect, useState } from "react";
import "../QL.scss";

const QLDichVu = () => {
  const [dichVuList, setDichVuList] = useState([]); 


  useEffect(() => {
    fetch("http://localhost:8000/dichvu/dichvu_QL")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setDichVuList(data))
      .catch((error) => console.error("Có lỗi xảy ra:", error));
  }, []);

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
            <th>Mô tả</th>
            <th>Thêm Ảnh</th>
          </tr>
        </thead>
        <tbody>
          {dichVuList.map((dichVu) => (
            <tr key={dichVu.id}>
              <td>{dichVu.id}</td>
              <td>{dichVu.ten_dv}</td>
              <td>{dichVu.ten_loai_dv}</td>
              <td>{dichVu.gia_dv.toLocaleString()} VND</td>
              <td>{dichVu.soluong}</td>
              <td>{dichVu.mota || "Không có mô tả"}</td>
              <td>
                <img
                  src={dichVu.image_dv}
                  alt={dichVu.ten_dv}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDichVu;
