import React, { useState } from 'react';
import "./register.scss";
function RegisterForm() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(null);
  const [message, setMessage] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

     // Check if password and confirm password match
     if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }
    
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('gender',gender);

    try {
      const response = await fetch('https://doan-ql-sanbong.onrender.com/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Đăng ký không thành công!'); // Lỗi từ API
      }

      setMessage(data.detail); // Lưu thông báo thành công
      setTimeout(() => {
        if (data.detail === 'Đăng kí tài khoản thành công') {
          window.location.href = '/login';
        }
      }, 1000); // 1500 ms = 1.5 seconds
    } catch (error) {
      setError(error.message); // Lưu thông báo lỗi
    }
};

  return (
    <div className='register'>
      <div className='register-form'>
      <h2>Đăng Ký Tài Khoản</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='HT'>
          <label>Họ và Tên:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
           
          />
        </div>
        <div className='EM'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            
          />
        </div>
        <div className='MK'>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            
          />
        </div>
        <div className='MK'>
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className='SDT'>
          <label>Số Điện Thoại:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            
          />
        </div>
        <div className='GT'>
            <label>Giới tính:</label>
            <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                
            >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
            </select>
        </div>
        <button type="submit">Đăng Ký</button>
      </form>
    </div>
    </div>
  );
}

export default RegisterForm;
