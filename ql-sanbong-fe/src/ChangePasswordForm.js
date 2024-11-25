import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './changePassword.scss';

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const accessToken = Cookies.get('access_token');
      if (!accessToken) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      setLoading(true); // Bắt đầu tải
      const response = await fetch('http://localhost:8000/change-password', {
        method: 'PUT', // Đổi thành PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      

      setLoading(false); // Kết thúc tải
      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText || '{}');
        throw new Error(errorData.message || errorText || 'Đổi mật khẩu không thành công.');
      }

      setSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="change-password-full">
      <div className="change-password-form">
        <h2>Đổi Mật Khẩu</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="field">
            <label>Mật khẩu hiện tại:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Mật khẩu mới:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Xác nhận mật khẩu mới:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
