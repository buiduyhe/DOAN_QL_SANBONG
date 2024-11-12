// src/SidebarAdmin/SidebarAdmin.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SlidebarAdmin.scss"
import adminIcon from "../../../assets/Home/stafficon.png";

const SidebarAdmin = ({ onMenuClick }) => {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch("api/admin"); // Cập nhật endpoint API nếu cần
        const data = await response.json();
        setAdminName(data.name);
      } catch (error) {
        console.error("Lỗi khi tải thông tin admin:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  return (
    <div className="sidebarAdmin">
      <div className="sidebar-header">
        <img src={adminIcon} alt="Admin Logo" />
        <h2 className="admin-name">{adminName}</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <a onClick={() => onMenuClick("employees")}>Quản lý nhân viên</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("customers")}>Quản lý khách hàng</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("services")}>Quản lý dịch vụ</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("courts")}>Quản lý sân</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("orders")}>Quản lý đơn đặt</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("suppliers")}>Quản lý nhà cung cấp</a>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
