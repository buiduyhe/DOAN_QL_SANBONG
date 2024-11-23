import React, { useState, useEffect } from "react";
import "../QL.scss";

const QLKhachHang = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
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
        setCustomer(data); // Gán toàn bộ danh sách khách hàng thay vì chỉ lấy [0]
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const handleRadioChange = (id) => {
    setSelectedId(id); // Gán ID của khách hàng được chọn
  };

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
            {customer && customer.length > 0 ? (
              customer.map((cus) => (
                <tr key={cus.id}>
                  <td> <input
                      type="radio"
                      name="customer"
                      onChange={() => handleRadioChange(cus.id)}
                      checked={selectedId === cus.id}
                      style={{ marginRight: "5px" }}
                    />
                    {cus.id}</td>
                  <td>{cus.full_name}</td>
                  <td>{cus.email}</td>
                  <td>{cus.phone}</td>
                  <td>{cus.gender === "FEMALE" ? "Nữ" : "Nam"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QLKhachHang;
