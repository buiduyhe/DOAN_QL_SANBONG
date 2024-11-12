import React from 'react'

const QLNhanVien = () => {
  return (
    <div>
        <h4>Quản lý nhân viên</h4>
      <table>
        <thead>
          <tr>
            <th>Mã Nhân Viên</th>
            <th>Tên Nhân Viên</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Giới Tính</th>
          </tr>
        </thead>
        <tbody>{/* them du lieu tu api */}</tbody>
      </table>
    </div>
  )
}

export default QLNhanVien