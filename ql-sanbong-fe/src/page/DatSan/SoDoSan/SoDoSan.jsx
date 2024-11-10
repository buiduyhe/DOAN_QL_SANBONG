import React, { useState, useEffect } from 'react';
import './SoDoSan.scss';
import fieldImage from "../../../assets/DatSan/SanBong.jpg";
import San_7 from "../../../assets/DatSan/San_7.jpg";
import ThongTinDatSan from '../ThongTinDatSan/ThongTinDatSan';

const SoDoSan = () => {
  const [fields, setFields] = useState([]); // State to store field data
  const [selectedField, setSelectedField] = useState(null); // State for the selected field
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Selected time slot
  const [selectedDate, setSelectedDate] = useState(null); // Selected date

  // Fetch field data from API
  useEffect(() => {
    fetch('https://672b14c2976a834dd0258200.mockapi.io/DatSan')
      .then((response) => response.json())
      .then((data) => setFields(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Get field by ID
  const getFieldById = (id) => fields.find((field) => field.id === id);

  // Handle field selection
  const handleFieldClick = (field) => {
    if (field.TinhTrang === "Da Dat San") {
      return; // Stop if the field is already reserved
    }
    setSelectedField(field); // Update selected field
  };

  return (
    <div className="stadium-layout">
      
      <div className="left-column">
        {/* Render "San 5" fields */}

        <div className="bottom-row">
        {/* Render "San 7" fields */}
        <Field field={getFieldById("S701")} onClick={() => handleFieldClick(getFieldById("S701"))} isLarge />
        <Field field={getFieldById("S702")} onClick={() => handleFieldClick(getFieldById("S702"))} isLarge />
      </div>
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

// Field component to display individual field info
const Field = ({ field, onClick, isLarge }) => {
  if (!field) return null;

  // Check if the field is reserved
  const isReserved = field.TinhTrang === "Da Dat San";

  // Define styles for reserved fields and background image based on field type
  const fieldStyle = isReserved ? { pointerEvents: 'none', opacity: 0.5 } : {};
  const backgroundImage = isLarge ? `url(${San_7})` : `url(${fieldImage})`;

  return (
    <div
      className={`field ${isReserved ? 'reserved' : ''} ${isLarge ? 'large-field' : ''}`}
      style={{ backgroundImage, ...fieldStyle }}
      onClick={onClick}
    >
      {field.id}
      {isReserved && <span className="reserved-text">Đã đặt sân</span>}
    </div>
  );
};

export default SoDoSan;
