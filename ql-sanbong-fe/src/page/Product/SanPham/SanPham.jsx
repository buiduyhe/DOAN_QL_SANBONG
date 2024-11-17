import React, { useState, useEffect } from 'react';
import Sidebar from '../../../component/Sidebar/Sidebar';
import './SanPham.scss';
import logo from '../../../assets/Home/logo.jpg';

const SanPham = ({onAddToCart}) => {
  // State variables
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Thứ tự');
  const [displayText, setDisplayText] = useState('TẤT CẢ SẢN PHẨM');
  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Fetch products and product types on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/dichvu/loaidichvu");
        if (!response.ok) throw new Error("Failed to fetch product types");
        
        const response2 = await fetch("http://127.0.0.1:8000/dichvu/dichvu");
        if (!response2.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const data2 = await response2.json();

        setProductType(data);
        setProducts(data2);
        setFilteredProducts(data2); // Initialize filteredProducts with all products
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, []);

  // Toggle sort dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle sort option selection
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    sortProducts(option);
  };

  // Handle category selection
  const handleCategoryClick = async (categoryName, categoryID) => {
    setDisplayText(categoryName);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/dichvu/dichvu/${categoryID}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products for this category");
      }
  
      const data = await response.json();
      console.log("Fetched data:", data);  // Debugging
      
      if (data.dichvu && Array.isArray(data.dichvu)) {
        setFilteredProducts(data.dichvu);  // Update filteredProducts with category-specific products
      } else {
        console.error("Invalid response format:", data);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setFilteredProducts([]);
    }
  };

  // Show all products
  const showAllProducts = () => {
    setDisplayText("TẤT CẢ SẢN PHẨM");
    setFilteredProducts(products);  // Reset to all products
  };

  // Sort products based on selected option
  const sortProducts = (option, productsToSort = filteredProducts) => {
    let sortedProducts = [...productsToSort];
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
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  // Filter products by price range
  const filterByPrice = (priceRange) => {
    let filtered = products;
    switch (priceRange) {
      case 'under-100k':
        filtered = products.filter(product => product.gia_dv < 100000);
        break;
      case '100k-200k':
        filtered = products.filter(product => product.gia_dv >= 100000 && product.gia_dv < 200000);
        break;
      case '200k-300k':
        filtered = products.filter(product => product.gia_dv >= 200000 && product.gia_dv < 300000);
        break;
      case '300k-500k':
        filtered = products.filter(product => product.gia_dv >= 300000 && product.gia_dv < 500000);
        break;
      case '500k-1000k':
        filtered = products.filter(product => product.gia_dv >= 500000 && product.gia_dv < 1000000);
        break;
      case 'above-1000k':
        filtered = products.filter(product => product.gia_dv >= 1000000);
        break;
      default:
        filtered = products;
        break;
    }
    setFilteredProducts(filtered);
  };

  return (
    <div className="san-pham">
      <div className="DanhMuc">
        <div className="sanpham">{displayText}</div>
        <div className="DanhMucSP">
          {/* "Tất cả sản phẩm" button */}
          <div className="img-btn" onClick={showAllProducts} style={{ cursor: 'pointer' }}>
            <img src={logo} className="btn-img" alt="Tất cả sản phẩm" />
            <span>Tất cả sản phẩm</span>
          </div>
          
          {/* Render product categories */}
          {productType.length > 0 ? (
            productType.map((type, index) => (
              <div
                className="img-btn"
                key={index}
                onClick={() => handleCategoryClick(type.ten_loai_dv, type.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`http://localhost:8000/${type.image_dv}`} // Ensure correct image path
                  alt={type.ten_loai_dv}
                  className="btn-img"
                />
                <span>{type.ten_loai_dv}</span>
              </div>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
      </div>

      {/* Sorting Dropdown */}
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

      {/* Price Filter Sidebar */}
      <div className="filter-by-price">
        <Sidebar onFilterChange={filterByPrice} />
      </div>

      {/* Product List */}
      <div className="product-list">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            className="product-item"
            key={product.id}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <img src={`http://127.0.0.1:8000/${product.image_dv}`} alt={product.ten_dv} />
            <h3>{product.ten_dv}</h3>
            <p>{product.mota || "Không có mô tả"}</p>
            <p style={{ color: "#007bff", fontWeight: "bold" }}>
              {product.gia_dv ? product.gia_dv.toLocaleString("vi-VN") + "₫" : "Giá không xác định"}
            </p>
            {hoveredProduct === product.id && (
              <button
                className="add-to-cart"
                onClick={() => onAddToCart(product)}
              >
                Thêm vào giỏ hàng
              </button>
            )}
          </div>
        ))
      ) : (
        <p>Không có sản phẩm</p>
      )}
    </div>
    </div>
  );
};

export default SanPham;
