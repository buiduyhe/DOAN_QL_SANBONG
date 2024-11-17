import React, { useState } from "react";
import SidebarAdmin from "./SidebarAdmin/SidebarAdmin";
import QLKhachHang from "../NhanVienPage/QLKhachHang/QLKhachHang";
import QLDichVu from "../NhanVienPage/QLDichVu/QLDichVu";
import QLDonDat from "../NhanVienPage/QLDonDat/QLDonDat";
import QLSan from "../NhanVienPage/QLSan/QLSan";
import QLNhanVien from "./QLNhanVien/QLNhanVien";
import QLNhaCungCap from "./QLNhaCungCap/QLNhaCungCap";
import "./Admin.scss";
import Cookies from "js-cookie";

const Admin = () => {
  const [activeContent, setActiveContent] = useState(null); // Nội dung hiển thị
  const [showAddForm, setShowAddForm] = useState(false); // Hiển thị form thêm
  const [formType, setFormType] = useState(""); // Loại form (employees, customers, services, ...)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    serviceName: "",
    serviceType: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  });

  const username = Cookies.get("username"); // Lấy thông tin người dùng từ Cookies

  const handleMenuClick = (content) => {
    setActiveContent(content);
    setShowAddForm(false); // Đóng form khi chọn menu khác
  };

  const handleLogoutClick = () => {
    Cookies.remove("access_token");
    Cookies.remove("username");
    Cookies.remove("user_role");
    window.location.href = "/"; // Chuyển hướng về trang đăng nhập
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      serviceName: "",
      serviceType: "",
      price: "",
      quantity: "",
      description: "",
      image: null,
    }); // Reset dữ liệu form

    if (activeContent === "employees") setFormType("employees");
    else if (activeContent === "customers") setFormType("customers");
    else if (activeContent === "services") setFormType("services");

    setShowAddForm(true); // Mở form thêm mới
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(`Dữ liệu form (${formType}):`, formData);

    // Xử lý logic gửi dữ liệu tới API hoặc lưu trữ tại đây
    // Ví dụ: gửi form dữ liệu
    if (formType === "services") {
      const serviceData = new FormData();
      serviceData.append("serviceName", formData.serviceName);
      serviceData.append("serviceType", formData.serviceType);
      serviceData.append("price", formData.price);
      serviceData.append("quantity", formData.quantity);
      serviceData.append("description", formData.description);
      serviceData.append("image", formData.image);

      console.log("Dịch vụ được gửi đi:", serviceData);
    }

    setShowAddForm(false); // Đóng form sau khi xử lý
  };

  return (
    <div className="AdminPage row">
      <div className="Admin-left col-md-2">
        <SidebarAdmin onMenuClick={handleMenuClick} />
      </div>

      <div className="Admin-right col-md-10">
        <div className="title">
          <h5>Admin: {username}</h5>
          <h5 onClick={handleLogoutClick}>Đăng xuất</h5>
        </div>

        <div className="content">
          {activeContent === "employees" && <QLNhanVien />}
          {activeContent === "customers" && <QLKhachHang />}
          {activeContent === "services" && <QLDichVu />}
          {activeContent === "orders" && <QLDonDat />}
          {activeContent === "courts" && <QLSan />}
          {activeContent === "suppliers" && <QLNhaCungCap />}
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
                  {formType === "employees"
                    ? "Thêm Nhân Viên"
                    : formType === "customers"
                    ? "Thêm Khách Hàng"
                    : "Thêm Dịch Vụ"}
                </h3>

                {/* Nhập dữ liệu cho form nhân viên/khách hàng */}
                {(formType === "employees" || formType === "customers") && (
                  <>
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
                    {formType === "employees" && (
                      <div>
                        <label>Mật Khẩu:</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}
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
                  </>
                )}

                {/* Nhập dữ liệu cho form dịch vụ */}
                {formType === "services" && (
                  <>
                    <div>
                      <label>Tên Dịch Vụ:</label>
                      <input
                        type="text"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Loại Dịch Vụ:</label>
                      <input
                        type="text"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Giá Dịch Vụ:</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Số Lượng:</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Mô Tả:</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label>Thêm Ảnh:</label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </>
                )}

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
      </div>
    </div>
  );
};

export default Admin;
