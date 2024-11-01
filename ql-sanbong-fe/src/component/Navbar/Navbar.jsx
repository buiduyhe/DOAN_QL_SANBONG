import React from "react";
import "./Navbar.scss";
import logo from "../../assets/logo.jpg";
const Navbar = () => {
  const handleRegisterClick = () => {
    window.location.href = "/register";
  };

  const handleLoginClick = () => {
    window.location.href = "/login";
  };
  return (
    <div className="NB">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <nav className="nav-bar">
        <ul>
          <li>
            <a href="#Home" className="active">
              Trang Chủ
            </a>
          </li>
          <li className="menu-item ">
            <a href="#Carousel">Giới Thiệu</a>
          </li>
          <li className="menu-item">
            <a href="#roadmap">Sản Phẩm</a>
          </li>
          <li className="menu-item">
            <a href="#connect-wallet">Liên Hệ</a>
          </li>
          <li className="menu-item">
            <a onClick={handleRegisterClick}>Đăng Ký</a>
          </li>
          <li className="menu-item">
            <a onClick={handleLoginClick}>Đăng Nhập</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
