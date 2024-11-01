import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Search.scss";
const Search = () => {
  const [fieldType, setFieldType] = useState("Sân 7");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");

  const timeSlots = [
    "5:00 AM - 6:30 AM",
    "6:30 AM - 8:00 AM",
    "8:00 AM - 9:30 AM",
    "9:30 AM - 11:00 AM",
    "11:00 AM - 12:30 PM",
    "12:30 PM - 2:00 PM",
    "2:00 PM - 3:30 PM",
    "3:30 PM - 5:00 PM",
    "5:00 PM - 6:30 PM",
    "6:30 PM - 8:00 PM",
    "8:00 PM - 9:30 PM",
    "9:30 PM - 11:00 PM",
  ];

  const handleSearch = () => {
    console.log("Loại sân:", fieldType);
    console.log("Ngày đặt:", selectedDate);
    console.log("Khoảng thời gian:", timeSlot);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
      }}
      className="search-container"
    >
      {/* Lựa chọn Loại Sân */}
      <select
        value={fieldType}
        onChange={(e) => setFieldType(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="Sân 7">Sân 7</option>
        <option value="Sân 5">Sân 5</option>
      </select>

      {/* Lịch chọn ngày */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Ngày Đặt"
        style={{ padding: "5px", height: "20px" }}
      />

      {/* Lựa chọn khoảng thời gian */}
      <select
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="">Chọn thời gian</option>
        {timeSlots.map((slot, index) => (
          <option key={index} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      {/* Nút Tìm kiếm */}
      <button onClick={handleSearch} style={{ padding: "5px 10px" }}>
        Tìm kiếm
      </button>
    </div>
  );
};

export default Search;
