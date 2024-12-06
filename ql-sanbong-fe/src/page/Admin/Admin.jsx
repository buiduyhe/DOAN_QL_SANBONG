import React, { useState,useEffect } from "react";
import SidebarAdmin from "./SidebarAdmin/SidebarAdmin";
import QLKhachHang from "../NhanVienPage/QLKhachHang/QLKhachHang";
import QLDichVu from "../NhanVienPage/QLDichVu/QLDichVu";
import QLDonDat from "../NhanVienPage/QLDonDat/QLDonDat";
import QLSan from "../NhanVienPage/QLSan/QLSan";
import QLNhanVien from "./QLNhanVien/QLNhanVien";
import QLNhaCungCap from "./QLNhaCungCap/QLNhaCungCap";
import PhieuNhap from "./PhieuNhap/QLPhieuNhap";
import "./Admin.scss";
import Cookies from "js-cookie";
import ThongKe from "./ThongKe/ThongKe";
import QLDuyeDat from "../NhanVienPage/QLDuyet/QLDuyetDat";
import axios from "axios";
import SaoLuu from "../NhanVienPage/BackUp&Restore/Bu&Rt";

const Admin = () => {
  const [activeContent, setActiveContent] = useState(null); // Nội dung hiển thị
  const [showAddForm, setShowAddForm] = useState(false); // Hiển thị form thêm
  const [showEditForm, setShowEditForm] = useState(false); // Hiển thị form thêm
  const [formType, setFormType] = useState(""); // Loại form (employees, customers, services, ...)
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([null]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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
    address: "",
    description: "",
    image: null,
    gia: "",
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

  const fetchSupplierData = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/Ncc/get-Ncc/${id}`);
      const supplier = response.data;
  
      setFormData({
        name: supplier.ten_ncc || "",
        email: supplier.email || "",
        phone: supplier.sdt || "",
        address: supplier.dia_chi || "",
        // other supplier-related fields if needed
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhà cung cấp:", error);
    }
  };
  
  const handleMenuClick = (content) => {
    setActiveContent(content);
    setShowAddForm(false); // Đóng form khi chọn menu khác
    setShowEditForm(false); // Đóng form khi chọn menu khác
  };
  const fetchUserData = async (selectedId) => {
    try {
      let response;
      if (activeContent === "courts") {
        response = await axios.get(`http://127.0.0.1:8000/san/get_san_by_id/${selectedId}`);
        const court = response.data;
        setFormData((prevData) => ({
          ...prevData,
          gia: court.gia_thue || ""
        }));
        
      } else {
        response = await axios.get(`http://127.0.0.1:8000/user/get_user_by_id/${selectedId}`);
        const user = response.data;
        setFormData({
          name: user.full_name || "",
          phone: user.phone || "",
          gender: user.gender === "MALE" ? "male" : user.gender === "FEMALE" ? "female" : "other",
          email: user.email || "",
          password: "", // Không hiển thị mật khẩu trong form
          gia: ""
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ", error);
    }
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
      address: "",
    }); // Reset dữ liệu form

    if (activeContent === "employees") setFormType("employees");
    else if (activeContent === "customers") setFormType("customers");
    else if (activeContent === "services") setFormType("services");
    else if (activeContent === "suppliers") setFormType("suppliers");
    setShowAddForm(true); // Mở form thêm mới
  };
  const handleEditClick = () => {
    if (selectedId) {
      // Fetch data for the supplier to populate the form
      if (activeContent === "suppliers") {
        fetchSupplierData(selectedId);
      } else {
        fetchUserData(selectedId);
      }
      setShowEditForm(true);  // Open edit form
      setFormType(activeContent === "employees" ? "employees" : activeContent === "customers" ? "customers" : activeContent === "suppliers" ? "suppliers" : "courts");
    } else {
      console.error("No selected ID found");
    }
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
  const handleSelect = (id) => {
    setSelectedId(id); // Lưu id được chọn
    console.log("Selected ID:", id); // Xử lý logic tùy ý
    if (activeContent === "employees") setFormType("employees");
    else if (activeContent === "customers") setFormType("customers");
    else if (activeContent === "courts") setFormType("courts");
    else if (activeContent === "suppliers") setFormType("suppliers");
  };
  const handleSelectIds = (ids) => {
    setSelectedIds(ids);
    console.log("Selected IDs in Admin:", ids); // You can use the selected IDs for any purpose
    if (activeContent === "services") setFormType("services");
  };
  const handleFormDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      return; // Dừng xử lý nếu người dùng chọn "Không"
    }
  
    // Kiểm tra xem selectedId hoặc selectedids có hợp lệ không
    if (!selectedId && (!selectedIds || selectedIds.length === 0 || selectedIds[0] === null)) {
      alert("Vui lòng chọn một mục để xóa.");
      return;
    }
  
    console.log(`Xóa ID:`, selectedId, selectedIds, formType); // Log ID cần xóa
    
    setMessage('');
    setError('');
    
    let apiUrl = '';
    let requestData = [];
    
    if (formType === 'services') {
      apiUrl = 'http://127.0.0.1:8000/dichvu/delete_dv';
      requestData = selectedIds.filter(id => id !== null); // Chỉ truyền mảng selectedIds
    } else if (formType === 'customers' || formType === 'employees') {
      apiUrl = `http://127.0.0.1:8000/user/delete_SysUser/${selectedId}`;
    } else if (formType === 'suppliers') {
      // Chắc chắn sử dụng đúng URL cho xóa NCC
      apiUrl = `http://127.0.0.1:8000/Ncc/delete-Ncc/${selectedId}`; // Đảm bảo đây là URL đúng để xóa NCC
    } else {
      console.error('Invalid form type:', formType); // Log chi tiết lỗi
      setError('Invalid form type. Please check your form configuration.');
      return; // Dừng xử lý nếu form type không hợp lệ
    }
  
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // Không cần body trong trường hợp DELETE nếu không có dữ liệu thêm
        body: JSON.stringify(requestData), 
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Xóa không thành công!'); // Lỗi từ API
      }
  
      alert('Xóa thành công!');
      refreshData(); // Lưu thông báo thành công
    } catch (error) {
      console.error('Error during delete:', error); // Log lỗi chi tiết
      setError(error.message); // Lưu thông báo lỗi
    }
  
    setShowAddForm(false); // Đóng form sau khi xử lý
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
    } else if (formType === 'suppliers'){
      apiUrl = 'http://localhost:8000/Ncc/create-Ncc';
        requestData.append('tenNcc', formData.name);
        requestData.append('diachi', formData.address);
        requestData.append('email', formData.email);
        requestData.append('sdt', formData.phone);
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: requestData,
      });

      const data = await response.json();
      console.log('Error detail:', data);
      console.log('Dữ liệu form gửi đi:', formData);

      if (!response.ok) {
        throw new Error(data.detail || 'Đăng ký không thành công!'); // Lỗi từ API
      }

      alert("Đăng ký thành công!");
      refreshData(); // Lưu thông báo thành công
    } catch (error) {
      setError(error.message); // Lưu thông báo lỗi
    }

    setShowAddForm(false);
  };
  const refreshData = () => {
    window.location.reload();
    setTimeout(() => {
      handleMenuClick(formType);
    }, 100)
  };
  
  const handleFormEditSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Bạn có chắc chắn muốn lưu các thay đổi này không?")) {
      return;
    }
    
    console.log(`Dữ liệu form (${formType}):`, formData);
  
    setMessage('');
    setError('');
  
    let apiUrl = '';
    let requestData = {};
    
    
    if (formType === 'employees' || formType === 'customers') {
      apiUrl = `http://127.0.0.1:8000/user/update_SysUser/${selectedId}`;
      requestData = {
        hoten: formData.name,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender === "male" ? "Nam" : formData.gender === "female" ? "Nữ" : "Khác",
      };
    } else if (formType === 'courts') {
      apiUrl = `http://127.0.0.1:8000/san/update_san/${selectedId}`;
      requestData = {
        gia: formData.gia,
      };
    }
    else if (formType === 'suppliers') {
      apiUrl = `http://127.0.0.1:8000/Ncc/update-Ncc/${selectedId}`;
      requestData = {
        ten_ncc: formData.name,
        dia_chi: formData.address,
        email: formData.email,
        sdt: formData.phone,
      };
    } else {
      console.error('Invalid form type:', formType);
      setError('Invalid form type. Please check your form configuration.');
      return;
    }
  
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Cập nhật không thành công!');
      }
  
      alert('Cập nhật thành công!');
      refreshData();
    } catch (error) {
      console.error('Error during update:', error);
      setError(error.message);
    }
  
    setShowEditForm(false); // Close the edit form after processing
  };
  return (
    <div className="AdminPage row">
      <div className="Admin-left col-md-2">
        <SidebarAdmin onMenuClick={handleMenuClick} />
      </div>

      <div className="Admin-right col-md-10">
        <div className="title">
          <h5>Tên nhân viên: {username}</h5>
          <h5 onClick={handleLogoutClick}>Đăng xuất</h5>
        </div>

        <div className="content">
          {activeContent === "employees" && <QLNhanVien onSelectId={handleSelect} />}
          {activeContent === "customers" && <QLKhachHang onSelectId={handleSelect} />}
          {activeContent === "services" && <QLDichVu onSelectIds={handleSelectIds} />}
          {activeContent === "orders" && <QLDonDat />}
          {activeContent === "order" && <QLDuyeDat />}
          {activeContent === "courts" && <QLSan onSelectId={handleSelect}/>}
          {activeContent === "suppliers" && <QLNhaCungCap onSelectId={handleSelect}/>}
          {activeContent === "statistics" && <ThongKe />}
          {activeContent === "SaoLuu" && <SaoLuu />}
          {activeContent === "PhieuNhap" && <PhieuNhap />}
          

        </div>

        {activeContent !== "order" && activeContent !== "orders" && activeContent !== "statistics" && activeContent !== "SaoLuu" &&activeContent !== "PhieuNhap" && (
          <div className="btn">
            {activeContent !== "courts" && <button onClick={handleAddClick}>Thêm</button>}
            {activeContent !== "courts" && <button onClick={handleFormDelete}>Xóa</button>}
            {activeContent !== "services" && <button onClick={handleEditClick}>Sửa</button>}
          </div>
        )}

{showEditForm && (
  <div className="overlay">
    <div className="modal">
      <form className="add-form" onSubmit={handleFormEditSubmit}>
        <h3>
          {formType === "employees" ? "Sửa Thông Tin Nhân Viên" : 
           formType === "customers" ? "Sửa Thông Tin Khách Hàng" : 
           formType === "courts" ? "Sửa Thông Tin Sân Bóng" : 
           formType === "suppliers" ? "Sửa Thông Tin Nhà Cung Cấp" : ""}
        </h3>

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
              <label>Mật Khẩu:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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

        {(formType === "courts") && (
          <>
            <div>
              <label>Giá Thuê:</label>
              <input
                type="text"
                name="gia"
                value={formData.gia}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        {formType === "suppliers" && (
          <>
            <div>
              <label>Tên Nhà Cung Cấp:</label>
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
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        <div className="modal-buttons">
          <button type="submit">Lưu </button>
          <button type="button" onClick={() => setShowEditForm(false)}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
)}


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
                {formType === "suppliers" && (
                  <>
                    <div>
                      <label>Tên Nhà Cung Cấp:</label>
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
                      <label>Số điện thoại:</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Địa chỉ:</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                </>
              )}


                <div className="modal-buttons">
                  <button type="submit">Lưu </button>
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
