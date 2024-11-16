import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StepSelector.scss";

const StepSelector = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(state?.timeSlot || "5:00 AM - 6:30 AM");
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (state?.timeSlot) {
      setSelectedTime(state.timeSlot);
    }
  }, [state]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/san/time_slot");
        const data = await response.json();
        const formattedTimeSlots = data.map(slot => ({
          time: `${slot.start_time} - ${slot.end_time}`,
          tinhtrang: slot.tinhtrang
        }));
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
      },
    });
  };

  return (
    <div className="step-selector">
      <label className="label">Đổi giờ đặt sân</label>
      <div className="time-options">
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            className={`time-slot ${slot.time === selectedTime ? "active" : ""}`}
            onClick={() => handleTimeChange(slot.time)}
            disabled={slot.tinhtrang === 0}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSelector;
