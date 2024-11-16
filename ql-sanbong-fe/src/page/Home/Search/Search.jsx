import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.scss";

const Search = () => {
  const [fieldType, setFieldType] = useState("Sân 7");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState("90");
  const [timeSlots, setTimeSlots] = useState([]);

  const navigate = useNavigate();

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

  const handleSearch = () => {
    if (!timeSlot && timeSlots.length > 0) {
      setTimeSlot(timeSlots[0]);
    }
    navigate("/DatSan", {
      state: {
        fieldType,
        selectedDate,
        timeSlot: timeSlot || timeSlots[0],
        duration,
        currentStep: 2,
        slot: timeSlot || timeSlots[0],
      },
    });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    }).format(date);
  };

  return (
    <div className="search-container">
      <select
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        style={{ padding: "5px" }}
      >
        {[...Array(3)].map((_, i) => {
          const date = new Date();
          const newDate = new Date(date.setDate(date.getDate() + i));
          let label = "";
          if (i === 0) label = "Hôm nay";
          else if (i === 1) label = "Ngày mai";
          else if (i === 2) label = "Ngày kia";
          return (
            <option key={i} value={newDate.toISOString().split('T')[0]}>
              {label} - {newDate.toLocaleDateString("vi-VN")}
            </option>
          );
        })}
      </select>

      <select
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="">Chọn thời gian</option>
        {timeSlots.map((slot, index) => {
          const now = new Date();
          const [startTime] = slot.split(" - ");
          const startDateTime = new Date(`${selectedDate.toLocaleDateString("en-US")} ${startTime}`);
          return (
            <option key={index} value={slot} hidden={startDateTime < now}>
              {slot}
            </option>
          );
        })}
      </select>

      <button onClick={handleSearch} style={{ padding: "5px 10px" }}>
        Tìm kiếm
      </button>
    </div>
  );
};

export default Search;
