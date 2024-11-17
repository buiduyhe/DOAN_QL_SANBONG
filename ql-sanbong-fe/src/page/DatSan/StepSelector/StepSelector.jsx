import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StepSelector.scss";

const StepSelector = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  function getVietnamTime() {
    const now = new Date();
    const vietnamOffset = 7 * 60; // Vietnam is UTC+7
    const localOffset = now.getTimezoneOffset();
    const vietnamTime = new Date(now.getTime() + (vietnamOffset + localOffset) * 60000);
    // Đặt giờ về 0 để tránh sai lệch khi chuyển đổi
    vietnamTime.setHours(0, 0, 0, 0);
    return vietnamTime;
  }

  const [selectedTime, setSelectedTime] = useState(state?.timeSlot || "5:00 AM - 6:30 AM");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(state?.selectedDate ? new Date(state.selectedDate) : getVietnamTime());

  useEffect(() => {
    if (state?.timeSlot) {
      setSelectedTime(state.timeSlot);
    }
    if (state?.selectedDate) {
      setSelectedDate(new Date(state.selectedDate));
    }
  }, [state]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/san/time_slot");
        const data = await response.json();
        const formattedTimeSlots = data.map(slot => `${slot.start_time} - ${slot.end_time}`);
        setTimeSlots(formattedTimeSlots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    navigate("/DatSan", {
      state: {
        ...state,
        timeSlot: time,
        selectedDate,
      },
    });
  };
  
  const handleDateChange = (date) => {
    const newDate = new Date(date);
    setSelectedDate(newDate);
  
    // Tìm khung giờ gần nhất có thể đặt
    const now = new Date();
    const vietnamTime = getVietnamTime();
    const isToday = newDate.toDateString() === vietnamTime.toDateString();
  
    let nearestTime = timeSlots.find((time) => {
      const [startTime] = time.split(" - ");
      const [hours, minutes] = startTime.split(":");
      const slotTime = new Date(newDate);
      slotTime.setHours(hours, minutes, 0, 0);
      return !isToday || slotTime > now;
    });
  
    // Nếu không có khung giờ nào hợp lệ, chọn khung giờ đầu tiên
    if (!nearestTime) {
      nearestTime = timeSlots[0];
    }
  
    setSelectedTime(nearestTime);
  
    // Điều hướng với thời gian và ngày được cập nhật
    navigate("/DatSan", {
      state: {
        ...state,
        selectedDate: newDate,
        timeSlot: nearestTime,
      },
    });
  };
  

  console.log("Current system date:", getVietnamTime().toLocaleString());

  return (
    <div className="step-selector">
      <div className="Date-Time">
        <div className="date-time-row">
          <label className="label">Ngày đặt sân:</label>
          <select
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => {
              handleDateChange(e.target.value);
            }}
            className="date-selector"
            style={{ marginLeft: "10px" }}
          >
            <option hidden >Chọn ngày</option>
            {[...Array(3)].map((_, i) => {
              const date = getVietnamTime();
              date.setDate(date.getDate() + i); // Tăng ngày đúng múi giờ Việt Nam

              const label =
                i === 0 ? "Hôm nay" : i === 1 ? "Ngày mai" : "Ngày kia";

              // Sử dụng định dạng ngày chính xác cho value
              const value = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

              return (
                <option key={i} value={value}>
                  {label} - {date.toLocaleDateString("vi-VN")}
                </option>
              );
            })}
          </select>
        </div>
        <div className="date-time-row" style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
          <label className="label" style={{ whiteSpace: "nowrap" }}>Giờ đặt sân:</label>
          <div className="time-options" style={{ marginLeft: "5px" }}>
            {timeSlots.map((time, index) => {
              const [startTime] = time.split(" - ");
              const [hours, minutes] = startTime.split(":");
              const slotTime = new Date(selectedDate);
              slotTime.setHours(hours, minutes, 0, 0);

              const isToday = selectedDate.toDateString() === getVietnamTime().toDateString();
              const isDisabled = isToday && slotTime < new Date();

              return (
                <button
                  key={index}
                  className={`time-slot ${time === selectedTime ? "active" : ""}`}
                  onClick={() => {
                    handleTimeChange(time);
                  }}
                  disabled={isDisabled}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSelector;