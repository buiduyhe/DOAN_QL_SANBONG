import React, { useState, useEffect } from 'react';
import './SoDoSan.scss';
import fieldImage from "../../../assets/DatSan/SanBong.jpg";
import ThongTinDatSan from '../ThongTinDatSan/ThongTinDatSan';

const SoDoSan = () => {
  const [fields, setFields] = useState([]); // State để lưu dữ liệu các sân
  const [selectedField, setSelectedField] = useState(null); // State để lưu sân đã chọn
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Thời gian đã chọn
  const [selectedDate, setSelectedDate] = useState(null); // Ngày đã chọn

  // Lấy dữ liệu sân từ API
  useEffect(() => {
    fetch('https://672b14c2976a834dd0258200.mockapi.io/DatSan')
      .then((response) => response.json())
      .then((data) => setFields(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Lấy thông tin sân theo ID
  const getFieldById = (id) => fields.find((field) => field.id === id);

  // Xử lý khi người dùng chọn sân
  const handleFieldClick = (field) => {
    if (field.TinhTrang === "Da Dat San") {
      return; // Ngừng xử lý nếu sân đã được đặt
    }
    setSelectedField(field); // Cập nhật sân đã chọn
  };

  return (
    <div className="stadium-layout">
      <div className="left-column">
        {/* Render các sân */}
        <div className="row">
          <Field field={getFieldById("S507")} onClick={() => handleFieldClick(getFieldById("S507"))} />
          <Field field={getFieldById("S505")} onClick={() => handleFieldClick(getFieldById("S505"))} />
          <Field field={getFieldById("S503")} onClick={() => handleFieldClick(getFieldById("S503"))} />
          <Field field={getFieldById("S501")} onClick={() => handleFieldClick(getFieldById("S501"))} />
        </div>
        <div className="row">
          <Field field={getFieldById("S508")} onClick={() => handleFieldClick(getFieldById("S508"))} />
          <Field field={getFieldById("S506")} onClick={() => handleFieldClick(getFieldById("S506"))} />
          <Field field={getFieldById("S504")} onClick={() => handleFieldClick(getFieldById("S504"))} />
          <Field field={getFieldById("S502")} onClick={() => handleFieldClick(getFieldById("S502"))} />
        </div>
      </div>

      <div className="mid-column">
        <div className="info-box-NVS">Nhà vệ sinh</div>
        <div className="info-box-QQL">Quầy quản lý</div>
        <div className="info-box large">Đường đi, giữ xe</div>
      </div>

      <div className="right-column">
        <div className="row">
          <Field field={getFieldById("S509")} onClick={() => handleFieldClick(getFieldById("S509"))} />
          <Field field={getFieldById("S511")} onClick={() => handleFieldClick(getFieldById("S511"))} />
        </div>
        <div className="row">
          <Field field={getFieldById("S510")} onClick={() => handleFieldClick(getFieldById("S510"))} />
          <Field field={getFieldById("S512")} onClick={() => handleFieldClick(getFieldById("S512"))} />
        </div>
      </div>

      <div className="layout-right">
        <ThongTinDatSan selectedField={selectedField} selectedTimeSlot={selectedTimeSlot} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

// Component Field để hiển thị thông tin sân
const Field = ({ field, onClick }) => {
  if (!field) return null; // Nếu không có field thì không render gì

  // Kiểm tra sân có được đặt chưa
  const isReserved = field.TinhTrang === "Da Dat San";

  // Định nghĩa style cho sân đã được đặt
  const fieldStyle = isReserved ? { pointerEvents: 'none', opacity: 0.5 } : {};

  return (
    <div
      className={`field ${isReserved ? 'reserved' : ''}`} // Thêm class reserved nếu sân đã được đặt
      style={{ backgroundImage: `url(${fieldImage})`, ...fieldStyle }} // Áp dụng ảnh nền và style
      onClick={onClick} // Xử lý click
    >
      {field.id}
      {isReserved && <span className="reserved-text">Đã đặt sân</span>}
    </div>
  );
};

export default SoDoSan;
