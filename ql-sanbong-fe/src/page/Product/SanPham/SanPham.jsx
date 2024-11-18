import React, { useState, useEffect } from 'react';
import { useCart } from '../../../CartContext';
import Sidebar from '../../../component/Sidebar/Sidebar';
import './SanPham.scss';
import logo from '../../../assets/Home/logo.jpg';

const SanPham = () => {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Thứ tự');
  const [displayText, setDisplayText] = useState('TẤT CẢ SẢN PHẨM');
  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchProductsAndTypes = async () => {
      try {
        const typeResponse = await fetch("http://127.0.0.1:8000/dichvu/loaidichvu");
        const productResponse = await fetch("http://127.0.0.1:8000/dichvu/dichvu");
        if (!typeResponse.ok || !productResponse.ok) throw new Error("Failed to fetch data");

        const types = await typeResponse.json();
        const products = await productResponse.json();

        setProductType(types);
        setProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductsAndTypes();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    sortProducts(option);
  };

  const handleCategoryClick = async (categoryName, categoryID) => {
    setDisplayText(categoryName);

    try {
      const response = await fetch(`http://127.0.0.1:8000/dichvu/dichvu/${categoryID}`);
      if (!response.ok) throw new Error("Failed to fetch products for this category");

      const data = await response.json();
      setFilteredProducts(data.dichvu || []);
    } catch (error) {
      console.error("Error fetching category products:", error);
      setFilteredProducts([]);
    }
  };

  const showAllProducts = () => {
    setDisplayText("TẤT CẢ SẢN PHẨM");
    setFilteredProducts(products);
  };

  const sortProducts = (option) => {
    const sortedProducts = [...filteredProducts];
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

  const filterByPrice = (priceRange) => {
    const filtered = products.filter((product) => {
      switch (priceRange) {
        case 'under-100k':
          return product.gia_dv < 100000;
        case '100k-200k':
          return product.gia_dv >= 100000 && product.gia_dv < 200000;
        case '200k-300k':
          return product.gia_dv >= 200000 && product.gia_dv < 300000;
        case '300k-500k':
          return product.gia_dv >= 300000 && product.gia_dv < 500000;
        case '500k-1000k':
          return product.gia_dv >= 500000 && product.gia_dv < 1000000;
        case 'above-1000k':
          return product.gia_dv >= 1000000;
        default:
          return true;
      }
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="san-pham">
      <div className="DanhMuc">
        <div className="sanpham">{displayText}</div>
        <div className="DanhMucSP">
          <div className="img-btn" onClick={showAllProducts} style={{ cursor: 'pointer' }}>
            <img src={logo} className="btn-img" alt="Tất cả sản phẩm" />
            <span>Tất cả sản phẩm</span>
          </div>
          {productType.length > 0 ? (
            productType.map((type) => (
              <div
                className="img-btn"
                key={type.id}
                onClick={() => handleCategoryClick(type.ten_loai_dv, type.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`http://127.0.0.1:8000/${type.image_dv}`}
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

      <div className="filter-by-price">
        <Sidebar onFilterChange={filterByPrice} />
      </div>

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
                <button className="add-to-cart" onClick={() => addToCart(product)}>
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
