import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./StepSelector.scss";

const StepSelector = () => {
  const { state } = useLocation(); // Nhận state từ useLocation
  const navigate = useNavigate(); // Để điều hướng lại trang với thông tin cập nhật
  const [selectedTime, setSelectedTime] = useState(state?.timeSlot || "5:00 AM - 6:30 AM"); // Đặt thời gian mặc định từ state

  useEffect(() => {
    if (state?.timeSlot) {
      setSelectedTime(state.timeSlot);
    }
  }, [state]);

  const timeSlots = state?.duration === "60" ? [
    "5:00 AM - 6:00 AM",
    "6:30 AM - 7:30 AM",
    "7:00 AM - 8:00 AM",
    "7:30 AM - 8:30 AM",
    "8:00 AM - 9:00 PM",
    "8:30 PM - 9:30 PM",
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
  ] : [
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

  // Hàm thay đổi giờ
  const handleTimeChange = (time) => {
    setSelectedTime(time);
    // Chuyển đến trang "DatSan" với thông tin cập nhật
    navigate("/DatSan", {
      state: {
        ...state,
        timeSlot: time, // Cập nhật lại timeSlot
      },
    });
  };

  return (
    <div className="step-selector">
      <label className="label">Đổi giờ đặt sân</label>
      <div className="time-options">
        {timeSlots.map((time, index) => (
          <button
            key={index}
            className={`time-slot ${time === selectedTime ? "active" : ""}`}
            onClick={() => handleTimeChange(time)} // Cập nhật giờ khi chọn
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSelector;
