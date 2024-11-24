import React, { useEffect, useState } from "react";
import "../QL.scss";
import "./QLDichVu.scss";

const QLDichVu = ({ onSelectIds }) => {
  const [dichVuList, setDichVuList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

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

  useEffect(() => {
    onSelectIds(selectedIds); // Pass the selected IDs to parent whenever it changes
  }, [selectedIds]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(dichVuList.map((dichVu) => dichVu.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowClick = (id) => {
    handleCheckboxChange(id);
  };

  return (
    <div>
      <h4>Quản lý Dịch Vụ</h4>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={dichVuList.length > 0 && selectedIds.length === dichVuList.length}
                style={{ marginRight: "5px" }}
              />
              Mã Dịch Vụ
            </th>
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
            <tr key={dichVu.id} onClick={() => handleRowClick(dichVu.id)} style={{ cursor: "pointer" }}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(dichVu.id)}
                  checked={selectedIds.includes(dichVu.id)}
                  style={{ marginRight: "5px" }}
                />
                {dichVu.id}
              </td>
              <td>{dichVu.ten_dv}</td>
              <td>{dichVu.ten_loai_dv}</td>
              <td>{dichVu.gia_dv.toLocaleString()} VND</td>
              <td>{dichVu.soluong}</td>
              <td>{dichVu.mota || "Không có mô tả"}</td>
              <td style={{ textAlign: "center" }}>
                <img
                  src={`http://localhost:8000/${dichVu.image_dv}`}
                  alt={dichVu.ten_dv}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    alignItems: "center",
                  }}
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
