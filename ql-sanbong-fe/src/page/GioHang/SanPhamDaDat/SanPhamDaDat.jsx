import React, { useState } from 'react';
import { useCart } from '../../../CartContext'; // Import context của bạn
import { useNavigate } from 'react-router-dom';  // Để điều hướng đến trang thanh toán
import Cookies from 'js-cookie';  // Đảm bảo đã cài thư viện js-cookie
import './SanPhamDaDat.scss';

const SanPhamDaDat = () => {

  // Lấy giỏ hàng và các hàm xử lý từ context
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  
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
  const handleCheckout = async () => {
    const selectedProducts = cartItems.filter(item => selectedItems[item.id]);
    const requestData = selectedProducts.map(item => ({
      dichvu_id: item.id,
      soluong: item.quantity,
    }));
    const token = Cookies.get("access_token") || '';

    try {
      const response = await fetch('http://127.0.0.1:8000/dichvu/dat_dv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token, // Add authorization header
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order placed successfully:', data);
        alert('Đặt hàng thành công!');
        // Remove selected items from cart
        selectedProducts.forEach(item => removeFromCart(item.id));
        // Navigate to another page if needed
        // Xóa các sản phẩm đã chọn khỏi giỏ hàng
        Object.keys(selectedItems).forEach(itemId => {
          if (selectedItems[itemId]) {
            removeFromCart(itemId); // Gọi hàm từ context để xóa sản phẩm khỏi giỏ hàng
          }
    });
      } else {
        console.error('Failed to place order:', await response.text());
        alert('Đặt hàng không thành công, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
    // Xóa các sản phẩm đã chọn khỏi giỏ hàng
    Object.keys(selectedItems).forEach(itemId => {
      if (selectedItems[itemId]) {
        removeFromCart(itemId); // Gọi hàm từ context để xóa sản phẩm khỏi giỏ hàng
      }
    });
    // Sau khi thanh toán xong, điều hướng tới trang thanh toán
    navigate("/cart"); 
  };
  const handleQuantityChange = (itemId, quantity) => {
    updateCartItemQuantity(itemId, quantity);
  };
  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (itemId) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
    if (confirmed) {
      removeFromCart(itemId); // Gọi hàm removeFromCart để xóa sản phẩm khỏi giỏ hàng
    }
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
                
                <p><h3>{item.ten_dv}</h3></p>
                <p>
                  {item.mota || "Không có mô tả"}</p>
                <p>
                  <strong>
                    {item.gia_dv ? item.gia_dv.toLocaleString("vi-VN") + "₫" : "Giá không xác định"}
                  </strong>
                </p>
                <p>
                  <div className="quantity-container">
                  <label>Số lượng:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  />
                </div> 
                </p> {/* Hiển thị số lượng */}
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
        Đặt hàng
      </button>
    </div>
  );
};

export default SanPhamDaDat;
