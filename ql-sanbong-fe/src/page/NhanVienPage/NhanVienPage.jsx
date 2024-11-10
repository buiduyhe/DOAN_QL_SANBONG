// src/pages/NhanVienPage.js
import React, { useState } from "react";
import SidebarVN from "./SidebarNV/SidebarVN";
import QLKhachHang from "./QLKhachHang/QLKhachHang";
import QLDichVu from "./QLDichVu/QLDichVu";
import QLDonDat from "./QLDonDat/QLDonDat";
import QLSan from "./QLSan/QLSan";
import "./NhanVienPage.scss";
const NhanVienPage = () => {
  const [activeContent, setActiveContent] = useState(null);
  const handleMenuClick = (content) => {
    setActiveContent(content);
  };
  return (
    <div className="NVPage row">
      <div className="NV-left col-md-2">
        <SidebarVN onMenuClick={handleMenuClick} />
      </div>
      <div className="NV-right col-md-10">
        <div className="title">
          <h2>Trang Nhân Viên</h2>
          <h5>Đăng xuất</h5>
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
