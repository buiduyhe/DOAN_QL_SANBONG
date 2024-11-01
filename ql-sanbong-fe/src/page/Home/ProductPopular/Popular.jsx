import React from "react";
import "./Popular.scss";
import p1 from "../../../assets/ball.jpeg";
import p2 from "../../../assets/bang1.jpeg";
import p3 from "../../../assets/giay1.jpeg";
import p4 from "../../../assets/redbull.jpeg";
import p5 from "../../../assets/revive.jpeg";
import p6 from "../../../assets/tat1.webp";
import p7 from "../../../assets/banggoi.jpg";
import p8 from "../../../assets/xit.jpeg";
const Popular = () => {
  const images = [p1, p2, p3, p4, p5, p6, p7, p8];

  return (
    <div className="Popular">
      <div className="UI container">
        <div className="title">DỊCH VỤ BÁN CHẠY CỦA CHÚNG TÔI</div>
        <div className="SP row">
          {images.map((image, index) => (
            <div className="col-md-3 image-container" key={index}>
              <img src={image} alt={`Popular service ${index + 1}`} />
              <button className="view-button">Xem ngay</button>
            </div>
          ))}
        </div>
        <div className="See-more">
          <button>Xem thêm</button>
        </div>
      </div>
    </div>
  );
};

export default Popular;
