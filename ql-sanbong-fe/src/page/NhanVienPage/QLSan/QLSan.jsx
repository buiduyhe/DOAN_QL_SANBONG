import React, { useState, useEffect } from "react";
import "../QL.scss";
import SearchBar from "../../Admin/SearchBar/SearchBar"; // Import SearchBar component

const QLSan = ({ onSelectId = () => {} }) => {
  const [data, setData] = useState([]); // State để lưu dữ liệu từ API
  const [filteredData, setFilteredData] = useState([]); // State để lưu dữ liệu đã lọc
  const [loading, setLoading] = useState(true); // State để hiển thị trạng thái loading
  const [error, setError] = useState(null); // State để hiển thị lỗi (nếu có)
  const [selectedId, setSelectedId] = useState(null);

  // Trạng thái tìm kiếm
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [searchField, setSearchField] = useState("id"); // Trường tìm kiếm (Mã Sân Bóng, Loại Sân, Tình Trạng)

  // Gọi API khi component được render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/san/san");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Set data ban đầu
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Bộ lọc dữ liệu theo từ khóa và trường tìm kiếm
  useEffect(() => {
    const filteredList = data.filter((san) => {
      let searchValue = san[searchField]?.toString().toLowerCase() || "";
  
      // Ánh xạ loại sân và tình trạng thành chuỗi mô tả
      if (searchField === "loai_san_id") {
        searchValue = san.loai_san_id === 1 ? "sân 5" : "sân 7";
      } else if (searchField === "trang_thai") {
        searchValue = san.trang_thai === 1 ? "còn trống" : "đang sử dụng";
      }
  
      return searchValue.includes(searchTerm.toLowerCase());
    });
    setFilteredData(filteredList);
  }, [searchTerm, searchField, data]);
  
  
  const handleCheckboxChange = (id) => {
    setSelectedId(id);
    onSelectId(id); // Gọi callback để truyền ID
  };
  return (
    <div>
      <h4>Quản lý Sân Bóng</h4>

      {/* Thanh tìm kiếm */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchField={searchField}
        setSearchField={setSearchField}
        searchLabel="Sân Bóng"
        searchOptions={[
          { value: "id", label: "Tìm kiếm theo mã sân bóng" },
          { value: "loai_san_id", label: "Tìm kiếm theo loại sân" },
          { value: "trang_thai", label: "Tìm kiếm theo tình trạng" },
        ]}
      />

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p>Lỗi: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mã Sân Bóng</th>
              <th>Loại Sân</th>
              <th>Giá thuê</th>
              <th>Tình Trạng</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((san) => (
              <tr key={san.id} onClick={() => handleCheckboxChange(san.id)}>
                <td>
                <input
                  type="radio"
                  name="san"
                  onChange={() => handleCheckboxChange(san.id)}
                  checked={selectedId === san.id}
                  style={{ marginRight: "5px" }}
                />
                  {san.id}</td>
                <td>{san.loai_san_id === 1 ? "Sân 5" : "Sân 7"}</td>
                <td>{san.gia_thue.toLocaleString()} VND</td>
                <td>{san.trang_thai === 1 ? "Còn trống" : "Đang sử dụng"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QLSan;
