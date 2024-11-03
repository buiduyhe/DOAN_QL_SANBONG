import React from "react";
import "./Booksan.scss";
import { useNavigate } from "react-router-dom"; // Nhập useHistory
import B1 from "../../../assets/Home/iconSan.png";
import B2 from "../../../assets/Home/cart.png";
import B3 from "../../../assets/Home/call.png";

const bookdata = [
  { img: B1, txt: "Đặt Sân Ngay", link: "/Home" },
  { img: B2, txt: "Thêm Các Dịch Vụ Hấp Dẫn", link: "/Product" },
  { img: B3, txt: "Liên Hệ Để Được Cap Kèo Đấu", link: "/LienHe" },
];
const Booksan = () => {
  const navigate = useNavigate();
  const handleImageClick = (link) => {
    if (link) {
      navigate(link);
    }
  };
  return (
    <div className="Book">
      <div className="UI container">
        <div className="row">
          {bookdata.map((item, index) => (
            <div className="col-md-4" key={index}>
              <img
                src={item.img}
                alt={item.txt}
                onClick={() => handleImageClick(item.link)}
              />
              <p>{item.txt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booksan;
