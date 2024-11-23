import React, { useState,useEffect } from "react";
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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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

  const [serviceTypes, setServiceTypes] = useState([]);
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/dichvu/loaidichvu');
        const data = await response.json();
        const serviceTypeNames = data.map((type) => ({ id: type.id, name: type.ten_loai_dv }));
        setServiceTypes(serviceTypeNames);
      } catch (error) {
        console.error('Error fetching service types:', error);
      }
    };

    fetchServiceTypes();
  }, []);

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
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(`Dữ liệu form (${formType}):`, formData);

    setMessage('');
    setError('');

    let apiUrl = '';
    let requestData = new FormData();

    if (formType === 'services') {
      apiUrl = 'http://127.0.0.1:8000/dichvu/dichvu';
        requestData.append('ten_dv', formData.serviceName);
        requestData.append('loaidichvu_id', formData.serviceType);
        requestData.append('gia_dv', formData.price);
        requestData.append('soluong', formData.quantity);
        requestData.append('mota', formData.description);
        requestData.append('image', formData.image);
    } else if (formType === 'customers') {
      apiUrl = 'http://127.0.0.1:8000/register';
        requestData.append('fullname', formData.name);
        requestData.append('email', formData.email);
        requestData.append('phone', formData.phone);
        requestData.append('password', formData.password);
        requestData.append('gender', formData.gender);
    } else if (formType === 'employees') {
      apiUrl = 'http://127.0.0.1:8000/register-nhanvien';
        requestData.append('fullname', formData.name);
        requestData.append('email', formData.email);
        requestData.append('phone', formData.phone);
        requestData.append('password', formData.password);
        requestData.append('gender', formData.gender);
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: requestData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Đăng ký không thành công!'); // Lỗi từ API
      }

      setMessage(data.detail);
      refreshData(); // Lưu thông báo thành công
    } catch (error) {
      setError(error.message); // Lưu thông báo lỗi
    }

    setShowAddForm(false); // Đóng form sau khi xử lý
  };
  const refreshData = () => {
    // Logic to refresh data
    if (activeContent === "employees") {
      // Fetch and update employees data
    } else if (activeContent === "customers") {
      // Fetch and update customers data
    } else if (activeContent === "services") {
      // Fetch and update services data
    }
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
          <button >Xóa</button>
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
                    : formType === "services"
                    ? "Thêm Dịch Vụ"
                    : "Thêm"
                  }
                </h3>

                {(formType === "employees") && (
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
                    <div>
                      <label>Số Điện Thoại nhân viên:</label>
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

                {(formType === "customers") && (
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
                      <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      >
                      <option value="">Chọn</option>
                      {serviceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                        {type.name}
                        </option>
                      ))}
                      </select>
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
         {message && <p style={{ color: 'green' }}>{message}</p>}
         {error && <p style={{ color: 'red' }}>{error}</p>}
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

export default Admin;
