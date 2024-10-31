import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
      setSuccess('Đăng nhập thành công!');
      // Xử lý token và chuyển hướng hoặc lưu thông tin người dùng nếu cần.
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
