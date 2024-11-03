import React from "react";
import bg from "../../assets/Home/bgFooter.png";
import logo from "../../assets/Home/logo.jpg";
import fb from "../../assets/Home/ic-facebook.png";
import tiltok from "../../assets/Home/ic-tiktok.png";
import x from "../../assets/Home/ic-x.png";
import tele from "../../assets/Home/ic-tele.png";
import lan from "../../assets/Home/language.png";
import "./Footer.scss";
const Footer = () => {
  return (
    <div className="footer Container-full">
      <div className="background">
        <img src={bg} alt="" />
      </div>
      <div className="footer-UI container">
        <div className="TON">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="social">
            <div className="fb">
              <img src={fb} alt="" />
            </div>
            <div className="x">
              <img src={x} alt="" />
            </div>
            <div className="tk">
              <img src={tiltok} alt="" />
            </div>
            <div className="tele">
              <img src={tele} alt="" />
            </div>
          </div>
          <div className="txt">
            <p>© 2023 Solana Foundation. All rights reserved.</p>
          </div>
        </div>
        <div className="links">
          <div className="feature">
            <ul>
              <h4 style={{ color: "#fff" }}>Danh Mục</h4>
              <li>
                <a href="#home">Trang Chủ</a>
              </li>
              <li>
                <a href="#Carousel">Giới Thiệu</a>
              </li>
              <li>
                <a href="#roadmap">Sản Phẩm</a>
              </li>
              <li>
                <a href="#connect-wallet">Liên Hệ</a>
              </li>
              <li>
                <a href="#support">Đăng Xuất</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-content">
          <h4>Địa chỉ liên hệ</h4>
          <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
          <p>Điện thoại: (123) 456-7890</p>
          <p>Email: contact@example.com</p>
        </div>
        <div className="CS">
          <h4>Liên hệ</h4>
          <div className="card-call">
            <div className="card-left">
              <p>chăm sóc khách hàng</p>
              <a href="" style={{ textDecoration: "none" }}>
                0919581455
              </a>
              <p>Hải Biết Chơi</p>
            </div>
            <div className="card-right">
              <button>Gọi Ngay</button>
            </div>
          </div>
        </div>
      </div>
      <div className="dp">
        <p>© 2023 Solana Foundation. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
