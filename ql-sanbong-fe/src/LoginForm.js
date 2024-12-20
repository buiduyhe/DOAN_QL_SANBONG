import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./login.scss"

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const response = await fetch('https://doan-ql-sanbong.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }).toString(),
      });
  
      if (!response.ok) {
        throw new Error('Đăng nhập không thành công.');
      }
  
      const data = await response.json();
      
      const userResponse = await fetch('https://doan-ql-sanbong.onrender.com/user/my-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.access_token}`,
        },
      });
  
      if (!userResponse.ok) {
        throw new Error('Không thể lấy thông tin người dùng.');
      }
  
      const userData = await userResponse.json();
      const userRole = userData && Array.isArray(userData.roles) && userData.roles.length > 0 ? userData.roles[0].name.trim().toLowerCase() : '';
      const username = userData && userData.full_name ? userData.full_name : '';
      
      // Save access token and other user info in cookies
      Cookies.set('access_token', data.access_token, { expires: 1, secure: true, sameSite: 'Strict' });
      Cookies.set('user_role', userRole, { expires: 1, secure: true, sameSite: 'Strict' });
      Cookies.set('username', username, { expires: 1, secure: true, sameSite: 'Strict' });
      Cookies.set('user_id', userData.id, { expires: 1, secure: true, sameSite: 'Strict' });
      
      setSuccess('Đăng nhập thành công!');
      
      // Wait for 5 seconds before redirecting based on user role
      setTimeout(() => {
        if (userRole === 'admin') {
          window.location.href = '/';
        } else if (userRole === 'supadmin') {
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      }, 1000); // 1500 ms = 1.5 seconds
  
    } catch (error) {
      setError(error.message);
    }
  };
  
  
  return (
    <div className='login-full'>
    <div className='login-form'>
      <h2>Đăng Nhập</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className='EM'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
         
          />
        </div>
        <div className='PW'>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
           
          />

        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Đăng Nhập</button>
      </form>
      <p >
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
    </div>
  );
}

export default LoginForm;
