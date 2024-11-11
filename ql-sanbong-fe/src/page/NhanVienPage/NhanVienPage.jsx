// src/pages/NhanVienPage.js
import React, { useState } from "react";
import SidebarVN from "./SidebarNV/SidebarVN";
import QLKhachHang from "./QLKhachHang/QLKhachHang";
import QLDichVu from "./QLDichVu/QLDichVu";
import QLDonDat from "./QLDonDat/QLDonDat";
import QLSan from "./QLSan/QLSan";
import "./NhanVienPage.scss";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";


const token = Cookies.get("access_token");
const username = Cookies.get("username");
const role = Cookies.get("user_role");


const NhanVienPage = () => {
  const [activeContent, setActiveContent] = useState(null);
  const location = useLocation();
  const errorMessage = location.state?.error;
  const handleMenuClick = (content) => {
    setActiveContent(content);
  };
  const handleLogoutClick = () => {
    Cookies.remove("access_token");
    Cookies.remove("username");
    Cookies.remove("user_role");
    window.location.href = "/";
  };
  return (
    <div className="NVPage row">
    {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="NV-left col-md-2">
        <SidebarVN onMenuClick={handleMenuClick} />
      </div>
      <div className="NV-right col-md-10">
        <div className="title">
          <h5>nhân viên: {username}</h5>
          <h5 onClick={handleLogoutClick}>Đăng xuất</h5>
        </div>

        <div className="Fix">
          {/* Dựa vào activeContent để hiển thị nội dung tương ứng */}
          {activeContent === "customers" && <QLKhachHang />}
          {activeContent === "services" && <QLDichVu />}
          {activeContent === "orders" && <QLDonDat />}
          {activeContent === "courts" && <QLSan />}
        </div>
        <div className="btn">
          <button>Thêm</button>
          <button>Xóa</button>
          <button>Sửa</button>
        </div>
        <div className="gohome" style={{ textAlign: "end" }}>
          <a
            href="/Home"
            style={{
              textDecoration: "none",
              color: "#000",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Về Trang Chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default NhanVienPage;
