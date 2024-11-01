import React, { useState } from "react";
import "./San.scss";
import s1 from "../../../assets/san1.jpeg";
import s2 from "../../../assets/san7.jpeg";
const San = () => {
  const [selectedImage, setSelectedImage] = useState(s1);

  const handleClick = (image) => {
    setSelectedImage(image);
  };
  return (
    <div className="San">
      <div className="San-UI container">
        <div className="title">LOẠI SÂN NỔI BẬT</div>
        <div className="NoiDung">
          <div className="Loai">
            <a
              onClick={() => {
                handleClick(s1);
              }}
            >
              Sân 5
            </a>
            <a onClick={() => handleClick(s2)}>Sân 7</a>
          </div>
          <div className="san-info row">
            <div className="col-md-6">
              <img
                src={selectedImage}
                alt="Sân"
                style={{ width: "100%", height: "400px", borderRadius: "10px" }}
              />
            </div>
            <div className="col-md-6">
              <a href="">shdvcjdhvd</a>
            </div>
          </div>
        </div>
        <div className="See-more">
          <button>Xem thêm</button>
        </div>
      </div>
    </div>
  );
};

export default San;
