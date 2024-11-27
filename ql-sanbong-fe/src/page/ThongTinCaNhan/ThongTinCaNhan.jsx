import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './ThongTinCaNhan.scss';

const ThongTinCaNhan = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);  // Trạng thái chỉnh sửa
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',  // Giữ nguyên email nhưng không cho chỉnh sửa
    phone: '',
    gender: '',
  });

  const userId = Cookies.get('user_id');
  const isLoggedIn = userId ? true : false;

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/user/get_SysUser/${userId}`);
          console.log(response.data);  // Kiểm tra dữ liệu từ API
          setUserData(response.data[0]);
          setFormData({
            full_name: response.data[0].full_name,
            email: response.data[0].email,
            phone: response.data[0].phone,
            gender: response.data[0].gender,
          });
        } catch (err) {
          setError('Không thể tải thông tin người dùng.');
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [isLoggedIn, userId]);
  const handleEditClick = () => {
    setEditing(true);  // Chuyển sang chế độ chỉnh sửa
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Đang thay đổi: ${name} với giá trị: ${value}`);  // Kiểm tra giá trị đầu vào
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    console.log('Dữ liệu gửi đi:', formData);  // Kiểm tra giá trị formData trước khi gửi
    try {
      const response = await axios.put(`http://localhost:8000/user/update_SysUser/${userId}`, formData);
      console.log('Dữ liệu phản hồi từ API:', response.data);  // Kiểm tra phản hồi
      setUserData(response.data);
      setEditing(false);  // Thoát chế độ chỉnh sửa
    } catch (err) {
      console.log('Lỗi khi cập nhật:', err);  // In lỗi nếu có
      setError('Không thể cập nhật thông tin.');
    }
  };

  const genderMap = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
  };

  if (!isLoggedIn) {
    return <p className="no-data">Chưa đăng nhập. Vui lòng đăng nhập để xem thông tin cá nhân.</p>;
  }

  if (loading) {
    return <p className="loading">Đang tải thông tin...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!userData) {
    return <p className="no-data">Không có dữ liệu người dùng.</p>;
  }

  return (
    <div className="thong-tin-ca-nhan">
      <h2>Thông Tin Người Dùng</h2>
      <div className="user-info">
        {editing ? (
          // Form chỉnh sửa
          <>
            <div className="info-item">
              <strong>Tên người dùng:</strong>
              <input
                type="text"
                name="full_name" 
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <p>{formData.email}</p>
            </div>
            <div className="info-item">
              <strong>Số điện thoại:</strong>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="info-item">
              <strong>Giới tính:</strong>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <button className="save-btn" onClick={handleSaveChanges}>Lưu thay đổi</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>Hủy</button>
          </>
        ) : (
          // Hiển thị thông tin người dùng
          <>
            <p className="info-item"><strong>Tên người dùng:</strong> {userData.full_name}</p>
            <p className="info-item"><strong>Email:</strong> {userData.email}</p>
            <p className="info-item"><strong>Số điện thoại:</strong> {userData.phone}</p>
            <p className="info-item"><strong>Giới tính:</strong> {genderMap[userData.gender] || 'Không xác định'}</p>
            <button className="edit-btn" onClick={handleEditClick}>Sửa Thông Tin</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ThongTinCaNhan;
