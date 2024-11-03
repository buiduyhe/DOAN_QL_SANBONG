import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./carousel.scss";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import C1 from "../../../assets/Home/C1.jpg";
import C2 from "../../../assets/Home/C2.jpg";
import C3 from "../../../assets/Home/C3.jpg";
import C4 from "../../../assets/Home/C4.jpg";
import C5 from "../../../assets/Home/C5.jpg";
import C6 from "../../../assets/Home/C6.jpg";
const imgDatas = [
  { avt: C1 },
  { avt: C2 },
  { avt: C3 },
  { avt: C4 },
  { avt: C5 },
  { avt: C6 },
];
const carousel = () => {
  return (
    <div className="SW" id="home">
      <Swiper
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        centerInsufficientSlides={true}
        slidesPerView={1}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Navigation, Autoplay]}
        className="swiper_container"
      >
        {imgDatas.map((client, index) => (
          <SwiperSlide key={index}>
            <div className="img-card">
              <img src={client.avt} className="img" />
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  );
};

export default carousel;
