import React, { useState } from "react";
import "./San.scss";
import s1 from "../../../assets/Home/san1.jpeg";
import s2 from "../../../assets/Home/san7.jpeg";
import tt1 from "../../../assets/Home/tintuc1.jpeg";
import tt2 from "../../../assets/Home/tintuc2.jpeg";
import tt3 from "../../../assets/Home/tintuc3.jpeg";
import tt4 from "../../../assets/Home/tintuc4.jpeg";
import tt5 from "../../../assets/Home/C6.jpg";
import tt6 from "../../../assets/Home/tintuc6.jpeg";

const ttsan = {
  san5: [
    {
      txt: "Sân bóng đá 5 người có kích thước nhỏ gọn, lý tưởng cho các trận đấu nhanh, giúp người chơi rèn luyện kỹ năng cá nhân và phối hợp đội nhóm hiệu quả.",
      src: tt1,
    },
    {
      txt: "Thiết kế sân bóng đá 5 người tập trung vào tốc độ, kỹ thuật, và phản xạ nhanh, tạo ra những trận đấu hấp dẫn và căng thẳng từ đầu đến cuối.",
      src: tt2,
    },
    {
      txt: "Với diện tích nhỏ, sân bóng đá 5 người giúp các cầu thủ luyện tập sự linh hoạt và tư duy chiến thuật, tăng khả năng tương tác và làm việc nhóm chặt chẽ.",
      src: tt3,
    },
  ],
  san7: [
    {
      txt: "Sân bóng đá 7 người có kích thước rộng hơn sân 5, cho phép các đội triển khai lối chơi chiến thuật đa dạng và hấp dẫn.",
      src: tt4,
    },
    {
      txt: "Với không gian rộng, sân bóng đá 7 người tạo điều kiện cho sự phối hợp đa dạng và hiệu quả trong các trận đấu.",
      src: tt5,
    },
    {
      txt: "Sân bóng đá 7 người là lựa chọn phù hợp cho các trận đấu sôi nổi, kết hợp giữa sự linh hoạt của sân nhỏ và chiều sâu chiến thuật.",
      src: tt6,
    },
  ],
};

const San = () => {
  const [selectedImage, setSelectedImage] = useState(s1);
  const [extraImages, setExtraImages] = useState(ttsan.san5);

  const handleClick = (image, type) => {
    setSelectedImage(image);
    setExtraImages(ttsan[type]);
  };
  return (
    <div className="San">
      <div className="San-UI container">
        <div className="title">LOẠI SÂN NỔI BẬT</div>
        <div className="NoiDung">
          <div className="Loai">
            <a
              onClick={() => {
                handleClick(s1, "san5");
              }}
            >
              {" "}
              Sân 5
            </a>
            <a onClick={() => handleClick(s2, "san7")}>Sân 7</a>
          </div>
          <div className="san-info row">
            <div className="left col-md-6">
              <img src={selectedImage} alt="Sân" />
            </div>
            <div className="right col-md-6">
              {extraImages.map((item, index) => (
                <div key={index} className="right-item">
                  <img src={item.src} alt={`Sân phụ ${index + 1}`} />

                  <p>{item.txt}</p>
                </div>
              ))}
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
