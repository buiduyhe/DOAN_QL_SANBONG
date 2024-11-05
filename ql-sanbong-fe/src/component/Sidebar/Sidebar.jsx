import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.scss';

const Sidebar = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [maxHeight, setMaxHeight] = useState('0px');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [isOpen]);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (category) => {
    onFilterChange(category);  // Gọi hàm lọc từ prop
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header" onClick={toggleFilter}>
        <h3>Giá sản phẩm</h3>
        <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
      </div>
      <div
        ref={contentRef}
        className="price-filter"
        style={{
          maxHeight: isOpen ? maxHeight : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
        }}
      >
        <label className="price-option" onClick={() => handleCategoryClick('under-100k')}>
          <input type="radio" name="price" value="under-100k" /> Giá dưới 100.000đ
        </label>
        <label className="price-option" onClick={() => handleCategoryClick('100k-200k')}>
          <input type="radio" name="price" value="100k-200k" /> 100.000đ - 200.000đ
        </label>
        <label className="price-option" onClick={() => handleCategoryClick('200k-300k')}>
          <input type="radio" name="price" value="200k-300k" /> 200.000đ - 300.000đ
        </label>
        <label className="price-option" onClick={() => handleCategoryClick('300k-500k')}>
          <input type="radio" name="price" value="300k-500k" /> 300.000đ - 500.000đ
        </label>
        <label className="price-option" onClick={() => handleCategoryClick('500k-1000k')}>
          <input type="radio" name="price" value="500k-1000k" /> 500.000đ - 1.000.000đ
        </label>
        <label className="price-option" onClick={() => handleCategoryClick('above-1000k')}>
          <input type="radio" name="price" value="above-1000k" /> Giá trên 1.000.000đ
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
