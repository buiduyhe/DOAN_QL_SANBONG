import React, { useState } from "react";
import SidebarVN from "./SidebarNV/SidebarVN";
import QLKhachHang from "./QLKhachHang/QLKhachHang";
import QLDichVu from "./QLDichVu/QLDichVu";
import QLDonDat from "./QLDonDat/QLDonDat";
import QLSan from "./QLSan/QLSan";
import "./NhanVienPage.scss";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const token = Cookies.get("access_token");
const username = Cookies.get("username");
const role = Cookies.get("user_role");

const NhanVienPage = () => {
  const [activeContent, setActiveContent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });
  const location = useLocation();
  const errorMessage = location.state?.error;

  const handleMenuClick = (content) => {
    setActiveContent(content);
  };

  const handleLogoutClick = () => {
    Cookies.remove("access_token");
    Cookies.remove("username");
    Cookies.remove("user_role");
    window.location.href = "/";
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
    });
    setActiveContent("customers"); // Chắc chắn rằng activeContent là "customers"
    setShowAddForm(true); // Set giá trị để hiển thị form
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data (customer):", formData); // Log data (in a real app, you would save it to a server)
    setShowAddForm(false); // Close the form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
    });
  };

  return (
    <div className="NVPage row">
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="NV-left col-md-2">
        <SidebarVN onMenuClick={handleMenuClick} />
      </div>

      <div className="NV-right col-md-10">
        <div className="title">
          <h5>Nhân viên: {username}</h5>
          <h5 onClick={handleLogoutClick}>Đăng xuất</h5>
        </div>

        <div className="Fix">
          {/* Dựa vào activeContent để hiển thị nội dung tương ứng */}
          {activeContent === "customers" && <QLKhachHang />}
          {activeContent === "services" && <QLDichVu />}
          {activeContent === "orders" && <QLDonDat />}
          {activeContent === "courts" && <QLSan />}
        </div>

        <div className="btn">
          <button onClick={handleAddClick}>Thêm</button>
          <button>Xóa</button>
          <button>Sửa</button>
        </div>

        {/* Chắc chắn form sẽ hiển thị khi showAddForm là true và activeContent là "customers" */}
        {showAddForm && activeContent === "customers" && (
          <div className="overlay">
            <div className="modal">
              <form className="add-form" onSubmit={handleFormSubmit}>
                <h3>Thêm Khách Hàng</h3>
                <div>
                  <label>Họ Tên:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Số Điện Thoại:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Giới Tính:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="modal-buttons">
                  <button type="submit">Lưu</button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="gohome" style={{ textAlign: "end" }}>
          <a
            href="/Home"
            style={{
              textDecoration: "none",
              color: "#000",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Về Trang Chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default NhanVienPage;
