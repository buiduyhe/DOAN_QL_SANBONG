import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./Search.scss";

const Search = () => {
  const [fieldType, setFieldType] = useState("Sân 7");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState("90");

  const timeSlots60Min = [
    "5:00 AM - 6:00 AM",
    "6:30 AM - 7:30 AM",
    "7:00 AM - 8:00 AM",
    "7:30 AM - 8:30 AM",
    "8:00 AM - 9:00 AM",
    "8:30 AM - 9:30 AM",
    "2:00 PM - 3:00 PM",
    "2:30 PM - 3:30 PM",
    "3:00 PM - 4:00 PM",
    "3:30 PM - 4:30 PM",
    "4:00 PM - 5:00 PM",
    "5:30 PM - 6:30 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "7:30 PM - 8:30 PM",
    "8:00 PM - 9:00 PM",
    "9:30 PM - 10:30 PM",
    "10:00 PM - 11:00 PM",
  ];

  const timeSlots90Min = [
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

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/DatSan", {
      state: {
        fieldType,
        selectedDate,
        timeSlot, // Truyền thông tin thời gian đã chọn
        duration,
        currentStep: 2, // Truyền giá trị step là "Chọn sân"
      },
    });
    console.log("Loại sân:", fieldType);
    console.log("Ngày đặt:", selectedDate);
    console.log("Khoảng thời gian:", timeSlot);
  };

  const availableTimeSlots =
    duration === "60" ? timeSlots60Min : timeSlots90Min;

  return (
    <div className="search-container">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Ngày Đặt"
        style={{ padding: "5px", height: "20px" }}
      />

      <select
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="">Chọn thời gian</option>
        {availableTimeSlots.map((slot, index) => (
          <option key={index} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <button onClick={handleSearch} style={{ padding: "5px 10px" }}>
        Tìm kiếm
      </button>
    </div>
  );
};

export default Search;
