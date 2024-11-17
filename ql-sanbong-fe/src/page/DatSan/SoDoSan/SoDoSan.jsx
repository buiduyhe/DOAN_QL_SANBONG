import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SoDoSan.scss';
import fieldImage from "../../../assets/DatSan/SanBong.jpg";
import San_7 from "../../../assets/DatSan/San_7.jpg";
import ThongTinDatSan from '../ThongTinDatSan/ThongTinDatSan';

const SoDoSan = () => {
  const location = useLocation();
  let { selectedDate, timeSlot } = location.state || {};
  if (!selectedDate) {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);  // Convert to GMT+7
    selectedDate = currentDate.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
  }
  
  const [fields, setFields] = useState([]); // State to store field data
  const [selectedField, setSelectedField] = useState(null); // State for the selected field
  const [availableFields, setAvailableFields] = useState([]); // State to store available fields

  // Fetch field data from API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/san/san')
      .then((response) => response.json())
      .then((data) => setFields(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Fetch available fields based on selected date and timeslot
  useEffect(() => {
    // Nếu selectedDate null, đặt giá trị mặc định là ngày của hệ thống
    
    
  
    // Fetch available fields based on selected date and timeslot
    if (selectedDate && timeSlot) {
      fetch('http://127.0.0.1:8000/san/san_available', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ngay_dat: selectedDate,
          batdau: timeSlot.split(' - ')[0],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched available fields:', data); // Log data to check its structure
          setAvailableFields(Array.isArray(data) ? data : []); // Ensure it's an array
        })
        .catch((error) => console.error("Error fetching available fields:", error));
    }
  }, [selectedDate, timeSlot]);
  

  // Get field by ID
  const getFieldById = (id) => fields.find((field) => field.id === id);

  // Handle field selection
  const handleFieldClick = (field) => {
    setSelectedField(field); // Update selected field
  };

  // Check if a field is available
  const isFieldAvailable = (fieldId) => {
    return availableFields.find((field) => field.san_id === fieldId)?.tinhtrang === true;
  };

  return (
    <div className="stadium-layout">
      <div className="left-column">
        <div className="row">
          <Field field={getFieldById("S507")} onClick={() => handleFieldClick(getFieldById("S507"))} isDisabled={!isFieldAvailable("S507")} />
          <Field field={getFieldById("S505")} onClick={() => handleFieldClick(getFieldById("S505"))} isDisabled={!isFieldAvailable("S505")} />
          <Field field={getFieldById("S503")} onClick={() => handleFieldClick(getFieldById("S503"))} isDisabled={!isFieldAvailable("S503")} />
          <Field field={getFieldById("S501")} onClick={() => handleFieldClick(getFieldById("S501"))} isDisabled={!isFieldAvailable("S501")} />
        </div>
        <div className="row">
          <Field field={getFieldById("S508")} onClick={() => handleFieldClick(getFieldById("S508"))} isDisabled={!isFieldAvailable("S508")} />
          <Field field={getFieldById("S506")} onClick={() => handleFieldClick(getFieldById("S506"))} isDisabled={!isFieldAvailable("S506")} />
          <Field field={getFieldById("S504")} onClick={() => handleFieldClick(getFieldById("S504"))} isDisabled={!isFieldAvailable("S504")} />
          <Field field={getFieldById("S502")} onClick={() => handleFieldClick(getFieldById("S502"))} isDisabled={!isFieldAvailable("S502")} />
        </div>
        <div className='row'>
          <Field field={getFieldById("S702")} onClick={() => handleFieldClick(getFieldById("S702"))} isLarge isDisabled={!isFieldAvailable("S702")} />
        </div>
      </div>

      <div className="mid-column">
        <div className="info-box info-box-NVS">Nhà vệ sinh</div>
        <div className="info-box info-box-QQL">Quầy quản lý</div>
        <div className="info-box large">Đường đi, giữ xe</div>
        <div className="row">
          <Field field={getFieldById("S701")} onClick={() => handleFieldClick(getFieldById("S701"))} isLarge isDisabled={!isFieldAvailable("S701")} />
        </div>
        
      </div>

      <div className="right-column">
        <div className="row">
          <Field field={getFieldById("S509")} onClick={() => handleFieldClick(getFieldById("S509"))} isDisabled={!isFieldAvailable("S509")} />
          <Field field={getFieldById("S511")} onClick={() => handleFieldClick(getFieldById("S511"))} isDisabled={!isFieldAvailable("S511")} />
        </div>
        <div className="row">
          <Field field={getFieldById("S510")} onClick={() => handleFieldClick(getFieldById("S510"))} isDisabled={!isFieldAvailable("S510")} />
          <Field field={getFieldById("S512")} onClick={() => handleFieldClick(getFieldById("S512"))} isDisabled={!isFieldAvailable("S512")} />
        </div>
        
      </div>

      <div className="layout-right">
        <ThongTinDatSan selectedField={selectedField} selectedTimeSlot={timeSlot} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

// Field component to display individual field info
const Field = ({ field, onClick, isLarge, isDisabled }) => {
  if (!field) return null;

  const backgroundImage = isLarge ? `url(${San_7})` : `url(${fieldImage})`;

  return (
    <div
      className={`field ${isDisabled ? 'reserved' : ''} ${isLarge ? 'large-field' : ''}`}
      style={{ backgroundImage }}
      onClick={!isDisabled ? onClick : null}
    >
      {field.id}
      {isDisabled && <span className="reserved-text">Đã đặt sân</span>}
    </div>
  );
};

export default SoDoSan;
