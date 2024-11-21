import React, { useEffect, useState } from "react";
import "../QL.scss";

const QLDonDat = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [chiTietHoaDon, setChiTietHoaDon] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [quantities, setQuantities] = useState({});


  useEffect(() => {
    fetch("http://127.0.0.1:8000/san/get_ds_hoadon")
      .then((response) => response.json())
      .then((data) => setHoaDons(data))
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:8000/dichvu/dichvu_QL")
      .then((response) => response.json())
      .then((data) => setSanPhams(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const fetchChiTietHoaDon = (ma_hoa_don) => {
    fetch(`http://localhost:8000/dichvu/get_chi_tiet_hoadon/${ma_hoa_don}`)
      .then((response) => response.json())
      .then((data) => setChiTietHoaDon(data))
      .catch((error) =>
        console.error("Error fetching chi tiết hóa đơn:", error)
      );
  };
  const refreshData = () => {
    fetch("http://127.0.0.1:8000/san/get_ds_hoadon")
      .then((response) => response.json())
      .then((data) => setHoaDons(data))
      .catch((error) => console.error("Error refreshing data:", error));

    // Nếu đã chọn hóa đơn, làm mới chi tiết hóa đơn
    if (selectedId) {
      fetchChiTietHoaDon(selectedId);
    }
  };

  const handleRowClick = (ma_hoa_don) => {
    setSelectedId(ma_hoa_don);
    fetchChiTietHoaDon(ma_hoa_don);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value, // Cập nhật số lượng cho sản phẩm theo ID
    }));
  };
  
  const handleAddProduct = (product) => {
    if (!selectedId) {
      alert("Vui lòng chọn hóa đơn trước khi thêm sản phẩm!");
      return;
    }

    const quantity = quantities[product.id] || 0; // Lấy số lượng từ state, mặc định là 0

    if (quantity <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ!");
      return;
    }
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.id]: 0, // Reset to 1 or any default value
    }));
    const newProduct = {
      dichvu_id: product.id,
      soluong: quantity,
    };

    fetch(`http://localhost:8000/dichvu/dat_dv_By_HoaDon/${selectedId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newProduct]),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log dữ liệu trả về từ API để kiểm tra chi tiết
        console.log("Response from API:", data);
        
        if (data.success) {
          // Cập nhật danh sách chi tiết hóa đơn sau khi thêm sản phẩm
          setChiTietHoaDon([
            ...chiTietHoaDon,
            { ...product, soluong: quantity },
          ]);
          setIsFormOpen(false);
          alert(data.message); // Thông báo thành công
        } else {
          alert(data.message); // Thông báo lỗi từ server
        }
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Có lỗi khi thêm sản phẩm!");
      });
  };


  const filteredSanPhams = sanPhams.filter((sp) =>
    sp.ten_dv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4>Quản lý Đơn Đặt</h4>
      {/* Bảng hóa đơn */}
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Đơn</th>
            <th>Tên người đặt</th>
            <th>Ngày Tạo</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          {hoaDons.map((hoaDon) => (
            <tr key={hoaDon.id} onClick={() => handleRowClick(hoaDon.id)}>
              <td>
                <input
                  type="radio"
                  name="hoadon"
                  checked={selectedId === hoaDon.id}
                  onChange={() => handleRowClick(hoaDon.id)}
                  onClick={(e) => e.stopPropagation()}
                />{hoaDon.STT}
              </td>
              <td>{hoaDon.ma_hoa_don}</td>
              <td>{hoaDon.ten_nguoi_dat}</td>
              <td>{new Date(hoaDon.ngay_tao).toLocaleDateString()}</td>
              <td>
                {hoaDon.trangthai === 0 ? "Chưa thanh toán" : "Đã thanh toán"}
              </td>
              <td>{hoaDon.tongtien}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chi tiết hóa đơn */}
      {selectedId && chiTietHoaDon.length > 0 && (
        <div className="chitiet-hoa-don">
          <h5>Chi Tiết Hóa Đơn</h5>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Sản Phẩm</th>
                <th>Số Lượng</th>
                <th>Đơn Giá</th>
                <th>Tổng Tiền</th>
              </tr>
            </thead>
            <tbody>
              {chiTietHoaDon.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.ten_san_pham}</td>
                  <td>{item.so_luong}</td>
                  <td>{item.don_gia}</td>
                  <td>{item.tong_tien}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="btn-chi-tiet-sp">
            <button onClick={() => setIsFormOpen(true)}>Thêm Sản Phẩm</button>
            <button>Thanh Toán</button>
          </div>
        </div>
      )}

      {/* Form thêm sản phẩm */}
      {isFormOpen && (
        <div className="form-them-san-pham">
          <div className="TT">
            <h5>Chọn Sản Phẩm</h5>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>Hình Ảnh</th>
                <th>Tên Sản Phẩm</th>
                <th>Giá</th>
                <th>Số Lượng</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSanPhams.map((product) => (
                <tr key={product.id}>
                  <td style={{ textAlign: "center" }}>
                    <img
                      src={`http://localhost:8000/${product.image_dv}`}
                      alt={product.ten_dv}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        alignItems: "center",
                      }}
                    />
                  </td>
                  <td>{product.ten_dv}</td>
                  <td>{product.gia_dv}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id]||0} // Lấy số lượng từ state
                      onChange={(e) =>
                        handleQuantityChange(product.id, Number(e.target.value))
                      }
                      style={{
                        width: "50px",
                        textAlign: "center",
                      }}
                    />
                  </td>
                  <td>
                  <button onClick={() => {
                    handleAddProduct(product);
                  }}>
                    Thêm
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="btn-actions">
            <button onClick={() => {
              refreshData();
              setIsFormOpen(false);}}>Thoát</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QLDonDat;
