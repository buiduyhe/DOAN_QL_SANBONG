import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

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
      const response = await fetch('http://localhost:8000/login', {
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
      
      const userResponse = await fetch('http://localhost:8000/user/my-profile', {
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
      
      setSuccess('Đăng nhập thành công!');
      
      // Wait for 5 seconds before redirecting based on user role
      setTimeout(() => {
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else if (userRole === 'supadmin') {
          window.location.href = '/supadmin';
        } else {
          window.location.href = '/';
        }
      }, 1000); // 1500 ms = 1.5 seconds
  
    } catch (error) {
      setError(error.message);
    }
  };
  
  
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Đăng Nhập</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Đăng Nhập</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default LoginForm;
