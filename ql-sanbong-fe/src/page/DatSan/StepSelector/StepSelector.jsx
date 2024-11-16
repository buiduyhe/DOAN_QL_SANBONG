import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StepSelector.scss";

const StepSelector = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedTime, setSelectedTime] = useState(state?.timeSlot || "5:00 AM - 6:30 AM");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(state?.selectedDate || new Date());

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
    setSelectedDate(new Date(date));
    navigate("/DatSan", {
      state: {
        ...state,
        selectedDate: new Date(date),
        timeSlot: selectedTime,
      },
    });
  };

  return (
    <div className="step-selector">
      <label className="label">Đổi ngày và giờ đặt sân</label>
      <div className="Date-Time">
      

      <div className="time-options">
        {timeSlots.map((time, index) => {
          const [startTime] = time.split(" - ");
          const [hours, minutes] = startTime.split(":");
          const slotTime = new Date(selectedDate);
          slotTime.setHours(hours, minutes, 0, 0);

          const isDisabled = slotTime < new Date();
          return (
            <button
              key={index}
              className={`time-slot ${time === selectedTime ? "active" : ""}`}
              onClick={() => handleTimeChange(time)}
              disabled={isDisabled}
            >
              {time}
            </button>
          );
        })}
      </div>
      <select
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => handleDateChange(e.target.value)}
        className="date-selector"
      >
        {[...Array(3)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          let label = "";
          if (i === 0) label = "Hôm nay";
          else if (i === 1) label = "Ngày mai";
          else if (i === 2) label = "Ngày kia";
          return (
            <option key={i} value={date.toISOString().split('T')[0]}>
              {label} - {date.toLocaleDateString("vi-VN")}
            </option>
          );
        })}
      </select>
      </div>
    </div>
  );
};

export default StepSelector;
