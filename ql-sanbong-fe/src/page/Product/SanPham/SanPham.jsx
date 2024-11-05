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
        const response = await fetch("https://6728f7106d5fa4901b6babb0.mockapi.io/LoaiSanPham");
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
        filtered = filtered.filter(product => product.Gia < 100000);
        break;
      case '100k-200k':
        filtered = filtered.filter(product => product.Gia >= 100000 && product.Gia < 200000);
        break;
      case '200k-300k':
        filtered = filtered.filter(product => product.Gia >= 200000 && product.Gia < 300000);
        break;
      case '300k-500k':
        filtered = filtered.filter(product => product.Gia >= 300000 && product.Gia < 500000);
        break;
      case '500k-1000k':
        filtered = filtered.filter(product => product.Gia >= 500000 && product.Gia < 1000000);
        break;
      case 'above-1000k':
        filtered = filtered.filter(product => product.Gia >= 1000000);
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
        sortedProducts.sort((a, b) => a.TenSanPham.localeCompare(b.TenSanPham));
        break;
      case 'Z → A':
        sortedProducts.sort((a, b) => b.TenSanPham.localeCompare(a.TenSanPham));
        break;
      case 'Giá tăng dần':
        sortedProducts.sort((a, b) => a.Gia - b.Gia);
        break;
      case 'Giá giảm dần':
        sortedProducts.sort((a, b) => b.Gia - a.Gia);
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
          </ul>
        )}
      </div>
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div className="product-item" key={product.id}>
            <img src={product.HinhAnh} alt={product.TenSanPham} />
            <h3>{product.TenSanPham}</h3>
            <p>{product.MoTa}</p>
            <p style={{ color: '#007bff', fontWeight: 'bold' }}>
              {product.Gia ? product.Gia.toLocaleString('vi-VN') + "₫" : "Giá không xác định"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SanPham;
