import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Stepper.scss';

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  // Lấy giá trị currentStep từ location.state nếu có
  useEffect(() => {
    if (location.state && location.state.currentStep) {
      setCurrentStep(location.state.currentStep);
    }
  }, [location.state]); // Chỉ chạy khi location.state thay đổi

  const steps = [
    "Chọn loại sân/ngày/giờ",
    "Chọn sân",
    "Thanh toán",
    "Xác nhận"
  ];

  // Tính toán chiều rộng của progress bar dựa trên currentStep
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="stepper">
      <ul className="steps">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`step ${index + 1 === currentStep ? 'active' : ''}`}
            onClick={() => setCurrentStep(index + 1)}
          >
            {step}
          </li>
        ))}
      </ul>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressWidth}%` }}></div>
      </div>
    </div>
  );
};

export default Stepper;
