import React from 'react';

const SanPhamDaDat = ({ cartItems, onRemoveFromCart }) => {
  return (
    <div className="gio-hang">
      <h2>Giỏ Hàng Của Bạn</h2>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={`http://127.0.0.1:8000/${item.image_dv}`} alt={item.ten_dv} />
              <div className="item-details">
                <h3>{item.ten_dv}</h3>
                <p>{item.mota || "Không có mô tả"}</p>
                <p>
                  <strong>
                    {item.gia_dv ? item.gia_dv.toLocaleString("vi-VN") + "₫" : "Giá không xác định"}
                  </strong>
                </p>
              </div>
              <button className="remove-from-cart" onClick={() => onRemoveFromCart(item.id)}>
                Xóa
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Giỏ hàng của bạn trống.</p>
      )}
    </div>
  );
};

export default SanPhamDaDat;
