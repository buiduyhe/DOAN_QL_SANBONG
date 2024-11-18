import React, { useState, useEffect } from "react";
import "../QL.scss";

const QLKhachHang = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/user/get_SysUser/3",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCustomer(data[0]);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false); // Dừng hiển thị trạng thái loading
      }
    };

    fetchCustomer();
  }, []);

  return (
    <div>
      <h4>Quản lý khách hàng</h4>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mã Khách Hàng</th>
              <th>Tên Khách Hàng</th>
              <th>Email</th>
              <th>Số Điện Thoại</th>
              <th>Giới Tính</th>
            </tr>
          </thead>
          <tbody>
            {customer ? (
              <tr>
                <td>{customer.id}</td>
                <td>{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.gender}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="5">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QLKhachHang;
