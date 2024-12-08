import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar"; 
import "./QLNhanVien.scss";

const QLNhanVien = ({ onSelectId = () => {} }) => {
  const [nhanVienList, setNhanVienList] = useState([]); 
  const [filteredNhanVienList, setFilteredNhanVienList] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchField, setSearchField] = useState("full_name"); 

 
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/get_SysUser/2")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setNhanVienList(data);
        setFilteredNhanVienList(data); 
      })
      .catch((error) => console.error("Có lỗi xảy ra:", error));
  }, []);

 
  useEffect(() => {
    const filteredList = nhanVienList.filter((nhanVien) =>
      nhanVien[searchField]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredNhanVienList(filteredList);
  }, [searchTerm, searchField, nhanVienList]);

  const handleCheckboxChange = (id) => {
    setSelectedId(id);
    onSelectId(id); 
  };

  return (
    <div>
      <h4>Quản lý nhân viên</h4>

     
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

      
      <table>
        <thead>
          <tr>
            <th>Mã Nhân Viên</th>
            <th>Tên Nhân Viên</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Giới Tính</th>
          </tr>
        </thead>
        <tbody>
          {filteredNhanVienList.map((nhanVien) => (
            <tr
              key={nhanVien.id}
              onClick={() => handleCheckboxChange(nhanVien.id)}
            >
              <td>
                <input
                  type="radio"
                  name="nhanVien"
                  onChange={() => handleCheckboxChange(nhanVien.id)}
                  checked={selectedId === nhanVien.id}
                  style={{ marginRight: "5px" }}
                />
                {nhanVien.id}
              </td>
              <td>{nhanVien.full_name}</td>
              <td>{nhanVien.email}</td>
              <td>{nhanVien.phone}</td>
              <td>
              {nhanVien.gender === "MALE"
                  ? "Nam"
                  : nhanVien.gender === "FEMALE"
                  ? "Nữ"
                  :nhanVien.gender === "Nữ"
                  ? "Nữ"
                  : nhanVien.gender === "Nam"
                  ? "Nam"
                  : "Khác"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLNhanVien;
