import React, { useState } from 'react';
import Sidebar from '../../../component/Sidebar/Sidebar';
import './SanPham.scss';

const SanPham = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Thứ tự');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    // Logic để xử lý sắp xếp có thể được thêm vào đây
    console.log(`Đã chọn sắp xếp: ${option}`);
  };

  return (
    <div className="san-pham">
      <div className="sort-dropdown">
        <span className="sort-label">Sắp xếp:</span> {/* Add sort label here */}
        <button onClick={toggleDropdown} className="sort-dropdown-button">
          {selectedOption} <span className="arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <ul className="sort-dropdown-menu">
            <li onClick={() => handleOptionClick('A → Z')}>A → Z</li>
            <li onClick={() => handleOptionClick('Z → A')}>Z → A</li>
            <li onClick={() => handleOptionClick('Giá tăng dần')}>Giá tăng dần</li>
            <li onClick={() => handleOptionClick('Giá giảm dần')}>Giá giảm dần</li>
            <li onClick={() => handleOptionClick('Hàng mới nhất')}>Hàng mới nhất</li>
            <li onClick={() => handleOptionClick('Hàng cũ nhất')}>Hàng cũ nhất</li>
          </ul>
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default SanPham;
