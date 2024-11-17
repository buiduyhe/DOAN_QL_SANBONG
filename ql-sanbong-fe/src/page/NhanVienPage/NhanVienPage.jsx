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
  const fieldConfigs = {
    customers: [
      { name: "customerID", label: "Mã Khách Hàng", type: "text" },
      { name: "name", label: "Tên Khách Hàng", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Số Điện Thoại", type: "text" },
      {
        name: "gender",
        label: "Giới Tính",
        type: "select",
        options: ["Nam", "Nữ", "Khác"],
      },
    ],
    services: [
      { name: "serviceID", label: "Mã Dịch Vụ", type: "text" },
      { name: "name", label: "Tên Dịch Vụ", type: "text" },
      { name: "category", label: "Loại Dịch Vụ", type: "text" },
      { name: "price", label: "Giá", type: "number" },
      { name: "quantity", label: "Số Lượng", type: "number" },
      { name: "description", label: "Mô tả", type: "text" },
      { name: "image", label: "Thêm Ảnh", type: "file" },
    ],
    orders: [
      { name: "orderID", label: "Mã Đơn", type: "text" },
      { name: "employeeID", label: "Mã Nhân Viên", type: "text" },
      { name: "customerID", label: "Mã Khách Hàng", type: "text" },
      { name: "date", label: "Ngày Tạo", type: "date" },
      { name: "status", label: "Trạng Thái", type: "text" },
      { name: "total", label: "Tổng Tiền", type: "number" },
      { name: "paymentMethod", label: "Hình Thức Thanh Toán", type: "text" },
    ],
    Stadium: [
      { name: "SanID", label: "Mã Sân", type: "text" },
      { name: "LoaiSan", label: "Loại Sân", type: "text" },
      { name: "Status", label: "Tình Trạng", type: "text" },
    ],
  };
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
    const fields = fieldConfigs[activeContent] || [];
    const initialData = fields.reduce((acc, field) => {
      acc[field.name] = field.type === "file" ? null : ""; // Chú ý trường file
      return acc;
    }, {});

    setFormData(initialData);
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value, // Lưu file khi chọn
    });
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
          {activeContent === "Stadium" && <QLSan />}
        </div>
        <div className="btn">
          <button onClick={handleAddClick}>Thêm</button>
          <button>Xóa</button>
          <button>Sửa</button>
        </div>
        {showAddForm && (
          <div className="overlay">
            <div className="modal">
              <form className="add-form" onSubmit={handleFormSubmit}>
                <h3>
                  Thêm{" "}
                  {activeContent === "customers"
                    ? "Khách Hàng"
                    : activeContent === "services"
                    ? "Dịch Vụ"
                    : "Đơn Đặt"}
                </h3>
                {fieldConfigs[activeContent]?.map((field) => (
                  <div key={field.name}>
                    <label>{field.label}:</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "file" ? (
                      <div>
                        <input
                          type="file"
                          name={field.name}
                          accept="image/*"
                          onChange={handleInputChange}
                          required
                        />
                        {formData[field.name] && (
                          <div style={{ marginTop: "10px" }}>
                            <img
                              src={URL.createObjectURL(formData[field.name])}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        required
                      />
                    )}
                  </div>
                ))}
                <div className="modal-buttons">
                  <button type="submit">Lưu</button>
                  <button type="button" onClick={() => setShowAddForm(false)}>
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
