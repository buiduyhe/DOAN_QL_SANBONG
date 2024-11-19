import React, { useEffect, useState } from "react";

const QLNhanVien = () => {
  const [nhanVienList, setNhanVienList] = useState([]); // State để lưu danh sách nhân viên
  const [selectedIds, setSelectedIds] = useState([]);
  // Gọi API khi component được render
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/get_SysUser/2")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setNhanVienList(data))
      .catch((error) => console.error("Có lỗi xảy ra:", error));
  }, []);

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id)); // Bỏ ID khỏi danh sách
    } else {
      setSelectedIds([...selectedIds, id]); // Thêm ID vào danh sách
    }
  };

  return (
    <div>
      <h4>Quản lý nhân viên</h4>
      <table>
        <thead>
          <tr>
            <th>
            <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedIds(
                    e.target.checked ? nhanVienList.map((nv) => nv.id) : []
                  )
                }
                checked={
                  nhanVienList.length > 0 &&
                  selectedIds.length === nhanVienList.length
                }
              />
            </th>
            <th>Mã Nhân Viên</th>
            <th>Tên Nhân Viên</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Giới Tính</th>
          </tr>
        </thead>
        <tbody>
          {nhanVienList.map((nhanVien) => (
            <tr key={nhanVien.id}>
              <td>
              <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(nhanVien.id)}
                  checked={selectedIds.includes(nhanVien.id)}
                />
              </td>
              <td>{nhanVien.id}</td>
              <td>{nhanVien.full_name}</td>
              <td>{nhanVien.email}</td>
              <td>{nhanVien.phone}</td>
              <td>{nhanVien.gender === "FEMALE" ? "Nữ" : "Nam"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLNhanVien;
