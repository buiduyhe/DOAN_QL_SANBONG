// src/SidebarNV/SidebarVN.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SidebarVN.scss";
import staff from "../../../assets/Home/stafficon.png";

const SidebarVN = ({ onMenuClick }) => {
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
          <a onClick={() => onMenuClick("customers")}>Quản lý khách hàng</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("services")}>Quản lý dịch vụ</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("orders")}>Quản lý đơn đặt</a>
        </li>
        <li>
          <a onClick={() => onMenuClick("Stadium")}>Quản lý sân</a>
        </li>
      </ul>
    </div>
  );
};

export default SidebarVN;
