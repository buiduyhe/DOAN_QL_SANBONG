import React, { useState, useEffect } from 'react';
import Sidebar from '../../../component/Sidebar/Sidebar';
import './SanPham.scss';
import quanao from '../../../assets/Product/QuanAo.png';
import gangtay from '../../../assets/Product/GangTay.png';
import giay from '../../../assets/Product/Giay.png';
import balo from '../../../assets/Product/Balo.png';
import phukien from '../../../assets/Product/PhuKien.png';

const SanPham = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Thứ tự');
  const [displayText, setDisplayText] = useState('TẤT CẢ SẢN PHẨM');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://6728f7106d5fa4901b6babb0.mockapi.io/LoaiSanPham");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
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
    sortProducts(option);
  };

  const handleCategoryClick = (category) => {
    let filtered = products;
    if (category === 'QuanAo') {
      setDisplayText('QUẦN ÁO ĐÁ BÓNG');
      filtered = products.filter(product => product.LoaiSanPham === 'QuanAo');
    } else if (category === 'GangTay') {
      setDisplayText('GĂNG TAY THỦ MÔN');
      filtered = products.filter(product => product.LoaiSanPham === 'GangTay');
    } else if (category === 'Giay') {
      setDisplayText('GIÀY BÓNG ĐÁ');
      filtered = products.filter(product => product.LoaiSanPham === 'Giay');
    } else if (category === 'Balo') {
      setDisplayText('BALO BÓNG ĐÁ');
      filtered = products.filter(product => product.LoaiSanPham === 'Balo');
    } else if (category === 'PhuKien') {
      setDisplayText('PHỤ KIỆN BÓNG ĐÁ');
      filtered = products.filter(product => product.LoaiSanPham === 'PhuKien');
    } else {
      setDisplayText('TẤT CẢ SẢN PHẨM');
      filtered = products;
    }
    setFilteredProducts(filtered);
  };
  

  const sortProducts = (option, productsToSort = filteredProducts) => {
    let sortedProducts = [...productsToSort];
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
    setFilteredProducts(sortedProducts);
  };
  const filterByPrice = (priceRange) => {
    let filtered = products;
    switch (priceRange) {
      case 'under-100k':
        filtered = products.filter(product => product.Gia < 100000);
        break;
      case '100k-200k':
        filtered = products.filter(product => product.Gia >= 100000 && product.Gia < 200000);
        break;
      case '200k-300k':
        filtered = products.filter(product => product.Gia >= 200000 && product.Gia < 300000);
        break;
      case '300k-500k':
        filtered = products.filter(product => product.Gia >= 300000 && product.Gia < 500000);
        break;
      case '500k-1000k':
        filtered = products.filter(product => product.Gia >= 500000 && product.Gia < 1000000);
        break;
      case 'above-1000k':
        filtered = products.filter(product => product.Gia >= 1000000);
        break;
      default:
        filtered = products;
        break;
    }
    setFilteredProducts(filtered);
  };

  return (
    <div className="san-pham">
      {/* Danh mục hiển thị phía trên sản phẩm */}
      <div className="DanhMuc">
        <div className="sanpham">{displayText}</div>
        <div className="DanhMucSP">
          <div className="img-btn" onClick={() => handleCategoryClick('QuanAo')}>
            <img src={quanao} className="btn-img" alt="Quần Áo" />
            <span>Quần Áo</span>
          </div>
          <div className="img-btn" onClick={() => handleCategoryClick('GangTay')}>
            <img src={gangtay} className="btn-img" alt="Găng Tay" />
            <span>Găng Tay</span>
          </div>
          <div className="img-btn" onClick={() => handleCategoryClick('Giay')}>
            <img src={giay} className="btn-img" alt="Giày" />
            <span>Giày</span>
          </div>
          <div className="img-btn" onClick={() => handleCategoryClick('Balo')}>
            <img src={balo} className="btn-img" alt="Balo" />
            <span>Balo</span>
          </div>
          <div className="img-btn" onClick={() => handleCategoryClick('PhuKien')}>
            <img src={phukien} className="btn-img" alt="Phụ Kiện" />
            <span>Phụ Kiện</span>
          </div>
        </div>

      </div>
      
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
      <Sidebar onFilterChange={filterByPrice} /> {/* Truyền hàm lọc vào Sidebar */}
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
