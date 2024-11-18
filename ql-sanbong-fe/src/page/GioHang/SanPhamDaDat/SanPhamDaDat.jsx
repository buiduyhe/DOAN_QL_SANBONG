import React, { useState } from 'react';
import { useCart } from '../../../CartContext'; // Import context của bạn
import { useNavigate } from 'react-router-dom';  // Để điều hướng đến trang thanh toán
import './SanPhamDaDat.scss';

const SanPhamDaDat = () => {
  // Lấy giỏ hàng và các hàm xử lý từ context
  const { cartItems, removeFromCart } = useCart();
  
  // State lưu trạng thái của các checkbox
  const [selectedItems, setSelectedItems] = useState({});
  
  const navigate = useNavigate();  // Hook điều hướng

  // Hàm để thay đổi trạng thái chọn sản phẩm
  const handleSelectItem = (itemId) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId], // Toggle chọn sản phẩm
    }));
  };

  // Tính tổng tiền cho các sản phẩm đã chọn
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + item.gia_dv * item.quantity; // Cộng dồn giá của sản phẩm đã chọn với số lượng
      }
      return total;
    }, 0);
  };

  // Hàm điều hướng tới trang thanh toán và xóa các sản phẩm đã chọn khỏi giỏ hàng
  const handleCheckout = () => {
    // Xóa các sản phẩm đã chọn khỏi giỏ hàng
    Object.keys(selectedItems).forEach(itemId => {
      if (selectedItems[itemId]) {
        removeFromCart(itemId); // Gọi hàm từ context để xóa sản phẩm khỏi giỏ hàng
      }
    });
    // Sau khi thanh toán xong, điều hướng tới trang thanh toán
    navigate("/checkout"); 
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId); // Gọi hàm removeFromCart để xóa sản phẩm khỏi giỏ hàng
  };

  const totalAmount = calculateTotal(); // Tính tổng tiền

  return (
    <div className="gio-hang">
      <h2>Giỏ Hàng Của Bạn</h2>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              {/* Checkbox bên trái ảnh */}
              <input
                type="checkbox"
                checked={selectedItems[item.id] || false}
                onChange={() => handleSelectItem(item.id)} // Toggle trạng thái checkbox
                className="item-checkbox"
              />
              <img src={`http://127.0.0.1:8000/${item.image_dv}`} alt={item.ten_dv} />
              <div className="item-details">
                
                <h3>{item.ten_dv}</h3>
                <p>{item.mota || "Không có mô tả"}</p>
                <p>
                  <strong>
                    {item.gia_dv ? item.gia_dv.toLocaleString("vi-VN") + "₫" : "Giá không xác định"}
                  </strong>
                </p>
                <p>Số lượng: {item.quantity}</p> {/* Hiển thị số lượng */}
                <p>
                  <strong>
                    Tổng tiền: {(item.gia_dv * item.quantity).toLocaleString("vi-VN")}₫ {/* Hiển thị giá tiền theo số lượng */}
                  </strong>
                </p>
                
              </div>
              <button 
                  className="remove-from-cart"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Xóa
                </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Giỏ hàng của bạn trống.</p>
      )}

      {/* Hiển thị tổng tiền */}
      {Object.values(selectedItems).some(value => value) && (
        <div className="total-price">
          <h3>Tổng tiền: {totalAmount.toLocaleString("vi-VN")}₫</h3>
        </div>
      )}

      {/* Nút thanh toán */}
      <button
        className="checkout-button"
        onClick={handleCheckout}
        disabled={totalAmount === 0} // Disable nếu không có sản phẩm nào được chọn
      >
        Thanh Toán
      </button>
    </div>
  );
};

export default SanPhamDaDat;
