import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Popular.scss";

const Popular = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

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

  const handleViewMore = () => {
    navigate("/product");
  };

  return (
    <div className="Popular">
      <div className="UI container">
        <div className="title">DỊCH VỤ BÁN CHẠY CỦA CHÚNG TÔI</div>
        <div className="SP row">
          {services.slice(0, 8).map((service, index) => ( // Display only first 8 items
            <div className="col-md-3 image-container" key={index}>
              <img src={`http://localhost:8000/${service.image_dv}`} alt={service.tendichvu} />
              <button onClick={handleViewMore} className="view-button">Xem ngay</button>
            </div>
          ))}
        </div>
        <div className="See-more">
          <button onClick={handleViewMore}>Xem thêm</button>
        </div>
      </div>
    </div>
  );
};

export default Popular;
