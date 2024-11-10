// src/SidebarNV/SidebarVN.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SidebarVN.scss";
import staff from "../../../assets/Home/stafficon.png";

const SidebarVN = () => {
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        const response = await fetch("api");
        const data = await response.json();
        setEmployeeName(data.name);
      } catch (error) {
        console.error("Lỗi khi tải thông tin nhân viên:", error);
      }
    };

    fetchEmployeeInfo();
  }, []);

  return (
    <div className="sidebarNV">
      <div className="sidebar-header">
        <img src={staff} alt="Logo" />
        {/* <h2 className="employee-name">{employeeName}</h2> */}
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/NhanVien/customers">Quản lý khách hàng</Link>
        </li>
        <li>
          <Link to="/NhanVien/services">Quản lý dịch vụ</Link>
        </li>
        <li>
          <Link to="/NhanVien/orders">Quản lý đơn đặt</Link>
        </li>
        <li>
          <Link to="/NhanVien/courts">Quản lý sân</Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarVN;
