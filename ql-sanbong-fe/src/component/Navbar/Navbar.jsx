import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate từ React Router
import "./Navbar.scss";
import logo from "../../assets/Home/logo.jpg";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const token = Cookies.get("access_token");
const username = Cookies.get("username"); // Assuming you store the username in a cookie
const role = Cookies.get("user_role");

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();  // Sử dụng useNavigate để điều hướng mà không reload trang

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    Cookies.remove("access_token");
    Cookies.remove("username");
    navigate("/");  // Điều hướng về trang chủ
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  const handleSupAdminClick = () => {
    navigate("/supadmin");
  };

  const handleCartClick = () => {
    navigate("/cart");  // Điều hướng về giỏ hàng
  };

  return (
    <div className="NB">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <nav className="nav-bar">
        <ul>
          <li>
            <a href="/Home">Trang Chủ</a>
          </li>
          <li className="menu-item">
            <a href="/gioithieu">Giới Thiệu</a>
          </li>
          <li className="menu-item">
            <a href="/product">Sản Phẩm</a>
          </li>
          <li className="menu-item">
            <a href="/LienHe">Liên Hệ</a>
          </li>
          <li className="menu-item">
            <a href="/DatSan">Đặt Sân</a>
          </li>
          {token ? (
            <>
              <li className="menu-item">
                <span>Chào, {username}</span>
              </li>
              <li className="menu-item">
                <a onClick={handleLogoutClick}>Đăng Xuất</a>
              </li>
              {role === "admin" && (
                <li className="menu-item">
                  <a onClick={handleAdminClick}>Trang Nhân Viên</a>
                </li>
              )}
              {role === "supadmin" && (
                <li className="menu-item">
                  <a onClick={handleSupAdminClick}>Trang Quản Lý</a>
                </li>
              )}
              <li className="menu-item cart-icon" onClick={handleCartClick}>
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="cart-count">{cartCount}</span>
              </li>
            </>
          ) : (
            <>
              <li className="menu-item">
                <a onClick={handleRegisterClick}>Đăng Ký</a>
              </li>
              <li className="menu-item">
                <a onClick={handleLoginClick}>Đăng Nhập</a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
