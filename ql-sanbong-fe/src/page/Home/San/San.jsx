import React from "react";
import "./San.scss";
const San = () => {
  return (
    <div className="San">
      <div className="San-UI container">
        <div className="title">LOẠI SÂN NỔI BẬT</div>
        <div className="NoiDung">
          <div className="Loai">
            <a href="">Sân 5</a>
            <a href="">Sân 7</a>
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
