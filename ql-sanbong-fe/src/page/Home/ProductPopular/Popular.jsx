import React, { useEffect, useState } from "react";
import "./Popular.scss";

const Popular = () => {
  const [services, setServices] = useState([]);

  // Gọi API để lấy danh sách dịch vụ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:8000/dichvu/dichvu"); // Thay bằng URL API của bạn
        if (!response.ok) throw new Error("Failed to fetch services");
        
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  return (
    <div className="Popular">
      <div className="UI container">
        <div className="title">DỊCH VỤ BÁN CHẠY CỦA CHÚNG TÔI</div>
        <div className="SP row">
        {services.map((service, index) => (
            <div className="col-md-3 image-container" key={index}>
               <img src={`http://localhost:8000/${service.image_dv}`} alt={service.tendichvu} />
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
