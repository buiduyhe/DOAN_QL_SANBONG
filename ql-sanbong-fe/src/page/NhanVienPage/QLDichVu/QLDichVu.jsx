import React, { useEffect, useState } from "react";
import "../QL.scss";
import "./QLDichVu.scss";
import SearchBar from "../../Admin/SearchBar/SearchBar"; // Import SearchBar component

const QLDichVu = ({ onSelectIds }) => {
  const [dichVuList, setDichVuList] = useState([]);
  const [filteredDichVuList, setFilteredDichVuList] = useState([]); // Danh sách dịch vụ đã lọc
  const [selectedIds, setSelectedIds] = useState([]);

  // Các trạng thái tìm kiếm
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [searchField, setSearchField] = useState("id"); // Trường tìm kiếm (Mã Dịch Vụ, Tên Dịch Vụ, Loại Dịch Vụ)

  useEffect(() => {
    fetch("http://localhost:8000/dichvu/dichvu_QL")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDichVuList(data);
        setFilteredDichVuList(data); // Set data ban đầu
      })
      .catch((error) => console.error("Có lỗi xảy ra:", error));
  }, []);

  // Filter dịch vụ khi từ khóa tìm kiếm hoặc trường tìm kiếm thay đổi
  useEffect(() => {
    const filteredList = dichVuList.filter((dichVu) =>
      dichVu[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDichVuList(filteredList); // Cập nhật danh sách dịch vụ đã lọc
  }, [searchTerm, searchField, dichVuList]);

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

  // Gọi callback khi selectedIds thay đổi
  useEffect(() => {
    onSelectIds(selectedIds);
  }, [selectedIds, onSelectIds]);

  return (
    <div>
      <h4>Quản lý Dịch Vụ</h4>

      {/* Thanh tìm kiếm */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchField={searchField}
        setSearchField={setSearchField}
        searchLabel="Dịch Vụ"
        searchOptions={[
          { value: "id", label: "Tìm kiếm theo mã" },
          { value: "ten_dv", label: "Tìm kiếm theo tên dịch vụ" },
          { value: "ten_loai_dv", label: "Tìm kiếm theo loại dịch vụ" },
        ]}
      />

      
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
          {filteredDichVuList.map((dichVu) => (
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
