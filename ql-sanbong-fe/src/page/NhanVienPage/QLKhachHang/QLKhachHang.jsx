import React, { useState, useEffect } from "react";
import SearchBar from "../../Admin/SearchBar/SearchBar";// Import SearchBar component
import "../QL.scss";

const QLKhachHang = ({ onSelectId = () => {} }) => {
  const [customer, setCustomer] = useState([]); // Danh sách khách hàng
  const [filteredCustomer, setFilteredCustomer] = useState([]); // Danh sách khách hàng đã lọc
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  
  // Các trạng thái tìm kiếm
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
  const [searchField, setSearchField] = useState("full_name"); // Trường tìm kiếm

  // Fetch dữ liệu khách hàng
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/user/get_SysUser/3",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCustomer(data); // Gán danh sách khách hàng
        setFilteredCustomer(data); // Hiển thị danh sách gốc ban đầu
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  // Xử lý tìm kiếm khi người dùng thay đổi trường tìm kiếm hoặc từ khóa tìm kiếm
  useEffect(() => {
    const filteredList = customer.filter((cus) =>
      cus[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomer(filteredList); // Cập nhật danh sách đã lọc
  }, [searchTerm, searchField, customer]);

  const handleRadioChange = (id) => {
    setSelectedId(id); // Gán ID của khách hàng được chọn
    onSelectId(id); // Gọi callback để truyền ID
  };

  return (
    <div>
      <h4>Quản lý khách hàng</h4>

      {/* Thanh tìm kiếm */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchField={searchField}
        setSearchField={setSearchField}
        searchLabel="Khách Hàng"
        searchOptions={[
          { value: "id", label: "Tìm kiếm theo mã" },
          { value: "full_name", label: "Tìm kiếm theo tên" },
          { value: "email", label: "Tìm kiếm theo email" },
          { value: "phone", label: "Tìm kiếm theo số điện thoại" },
        ]}
      />

      {/* Bảng danh sách khách hàng */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
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
          <tbody>
            {filteredCustomer.length > 0 ? (
              filteredCustomer.map((cus) => (
                <tr key={cus.id} onClick={() => handleRadioChange(cus.id)}>
                  <td>
                    <input
                      type="radio"
                      name="customer"
                      onChange={() => handleRadioChange(cus.id)}
                      checked={selectedId === cus.id}
                      style={{ marginRight: "5px" }}
                    />
                    {cus.id}
                  </td>
                  <td>{cus.full_name}</td>
                  <td>{cus.email}</td>
                  <td>{cus.phone}</td>
                  <td>
                {cus.gender === "MALE"
                  ? "Nam"
                  : cus.gender === "FEMALE"
                  ? "Nữ"
                  :cus.gender === "Nữ"
                  ? "Nữ"
                  : cus.gender === "Nam"
                  ? "Nam"
                  : "Khác"}
              </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QLKhachHang;
