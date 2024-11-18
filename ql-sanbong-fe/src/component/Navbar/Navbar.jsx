import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext"; // Import useCart từ CartContext
import "./Navbar.scss";
import logo from "../../assets/Home/logo.jpg";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Lấy thông tin từ Cookies
const token = Cookies.get("access_token");
const username = Cookies.get("username");
const role = Cookies.get("user_role");

const Navbar = () => {
  const navigate = useNavigate();
  const { getTotalQuantity } = useCart();  // Lấy hàm getTotalQuantity từ CartContext
  const cartCount = getTotalQuantity(); // Lấy số lượng sản phẩm trong giỏ hàng

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    Cookies.remove("access_token");
    Cookies.remove("username");
    Cookies.remove(`cart_${username}`); // Xóa giỏ hàng khi người dùng đăng xuất
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
        <img src={logo} alt="Logo" />
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
                <a href="" onClick={handleLogoutClick}>Đăng Xuất</a>
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
              {/* Biểu tượng giỏ hàng */}
              <li className="menu-item cart-icon" onClick={handleCartClick}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
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
