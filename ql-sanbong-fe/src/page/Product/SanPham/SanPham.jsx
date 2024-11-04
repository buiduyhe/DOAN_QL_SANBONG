import React, { useState, useEffect } from 'react';
import Sidebar from '../../../component/Sidebar/Sidebar';
import './SanPham.scss';

const SanPham = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Thứ tự');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/dichvu/dichvu");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Đặt danh sách sản phẩm đã lọc ban đầu là danh sách sản phẩm
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    console.log(`Đã chọn sắp xếp: ${option}`);
    sortProducts(option); // Gọi hàm sắp xếp khi lựa chọn
  };

  const handleFilterChange = (filterValue) => {
    let filtered = [...products]; // Tạo bản sao của mảng sản phẩm

    switch (filterValue) {
      case 'under-100k':
        filtered = filtered.filter(product => product.gia_dv < 100000);
        break;
      case '100k-200k':
        filtered = filtered.filter(product => product.gia_dv >= 100000 && product.gia_dv < 200000);
        break;
      case '200k-300k':
        filtered = filtered.filter(product => product.gia_dv >= 200000 && product.gia_dv < 300000);
        break;
      case '300k-500k':
        filtered = filtered.filter(product => product.gia_dv >= 300000 && product.gia_dv < 500000);
        break;
      case '500k-1000k':
        filtered = filtered.filter(product => product.gia_dv >= 500000 && product.gia_dv < 1000000);
        break;
      case 'above-1000k':
        filtered = filtered.filter(product => product.gia_dv >= 1000000);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm đã lọc
    sortProducts(selectedOption, filtered); // Sắp xếp danh sách sản phẩm đã lọc
  };

  const sortProducts = (option, productsToSort = filteredProducts) => {
    let sortedProducts = [...productsToSort]; // Tạo bản sao của mảng sản phẩm đã lọc

    switch (option) {
      case 'A → Z':
        sortedProducts.sort((a, b) => a.ten_dv.localeCompare(b.ten_dv));
        break;
      case 'Z → A':
        sortedProducts.sort((a, b) => b.ten_dv.localeCompare(a.ten_dv));
        break;
      case 'Giá tăng dần':
        sortedProducts.sort((a, b) => a.gia_dv - b.gia_dv);
        break;
      case 'Giá giảm dần':
        sortedProducts.sort((a, b) => b.gia_dv - a.gia_dv);
        break;
      case 'Hàng mới nhất':
        sortedProducts.sort((a, b) => new Date(b.ngay_them) - new Date(a.ngay_them)); // Giả sử bạn có trường ngày thêm
        break;
      case 'Hàng cũ nhất':
        sortedProducts.sort((a, b) => new Date(a.ngay_them) - new Date(b.ngay_them)); // Giả sử bạn có trường ngày thêm
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts); // Cập nhật danh sách sản phẩm đã sắp xếp
  };

  return (
    <div className="san-pham">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="sort-dropdown">
        <div className="sort-label-button">
          <span className="sort-label">Sắp xếp:</span>
          <button onClick={toggleDropdown} className="sort-dropdown-button">
            {selectedOption} <span className="arrow">{isOpen ? '▲' : '▼'}</span>
          </button>
        </div>
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
      <div className="product-list">
        {filteredProducts.map((product, index) => (
          <div className="product-item" key={index}>
            <img src={`http://localhost:8000/${product.image_dv}`} alt={product.ten_dv} />
            <h3>{product.ten_dv}</h3>
            <p>{product.gia_dv} VND</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default SanPham;
