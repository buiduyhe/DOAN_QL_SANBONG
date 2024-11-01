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
  const handleProductsClick = () => {
    window.location.href = "/product"; // Điều hướng đến trang sản phẩm
  };
  const handleHomeClick = () => {
    window.location.href = "/Home"; // Điều hướng đến trang sản phẩm
  };
  return (
    <div className="NB">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <nav className="nav-bar">
        <ul>
        <li className="menu-item">
            <a onClick={handleHomeClick}>Sản Phẩm</a>
          </li>
          <li className="menu-item ">
            <a href="#Carousel">Giới Thiệu</a>
          </li>
          <li className="menu-item">
            <a onClick={handleProductsClick}>Sản Phẩm</a>
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
