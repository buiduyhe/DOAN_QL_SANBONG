// src/pages/NhanVienPage.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import SidebarVN from "./SidebarNV/SidebarVN";
import QLKhachHang from "./QLKhachHang/QLKhachHang";
import QLDichVu from "./QLDichVu/QLDichVu";
import QLDonDat from "./QLDonDat/QLDonDat";
import QLSan from "./QLSan/QLSan";
import "./NhanVienPage.scss";
const NhanVienPage = () => {
  return (
    <div className="NVPage row">
      <div className="NV-left col-md-2">
        <SidebarVN />
      </div>
      <div className="NV-right col-md-10">
        <h2>Trang Nhân Viên</h2>
        <div className=""></div>
      </div>
    </div>
  );
};

export default NhanVienPage;
