import React from 'react'

const QLNhaCungCap = () => {
  return (
    <div>
        <h4>Quản lý nhà cung cấp</h4>
      <table>
        <thead>
          <tr>
            <th>Mã NCC</th>
            <th>Tên NCC</th>
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

export default QLNhaCungCap