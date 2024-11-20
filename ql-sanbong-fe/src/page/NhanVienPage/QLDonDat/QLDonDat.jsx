import React, { useEffect, useState } from "react";
import "../QL.scss";

const QLDonDat = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [chiTietHoaDon, setChiTietHoaDon] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/san/get_ds_hoadon')
      .then(response => response.json())
      .then(data => setHoaDons(data))
      .catch(error => console.error('Error fetching data:', error));

    fetch('http://localhost:8000/dichvu/dichvu_QL')
      .then(response => response.json())
      .then(data => setSanPhams(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  

  const fetchChiTietHoaDon = (ma_hoa_don) => {
    fetch(`http://localhost:8000/dichvu/get_chi_tiet_hoadon/${ma_hoa_don}`)
      .then(response => response.json())
      .then(data => setChiTietHoaDon(data))
      .catch(error => console.error('Error fetching chi tiết hóa đơn:', error));
  };

  const handleRowClick = (ma_hoa_don) => {
    setSelectedId(ma_hoa_don);
    fetchChiTietHoaDon(ma_hoa_don); // Gọi API để lấy chi tiết hóa đơn
  };

  const handleAddProduct = (product) => {
    const newProduct = {
      dichvu_id: product.id,
      soluong: 1,
    };
    
    if (!selectedId) {
      alert("Vui lòng chọn hóa đơn trước khi thêm sản phẩm!");
      return;
    }
  
    // Gửi dữ liệu đến API, now sending an array
    fetch(`http://localhost:8000/dichvu/dat_dv_By_HoaDon/${selectedId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newProduct]), // Wrap newProduct in an array
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Cập nhật danh sách chi tiết hóa đơn
          setChiTietHoaDon([...chiTietHoaDon, newProduct]);
          setIsFormOpen(false); // Đóng form
        } else {
          alert("Thêm sản phẩm thất bại!");
        }
      })
      .catch((error) => console.error("Error adding product:", error));
  };
  
  

  const filteredSanPhams = sanPhams.filter(sp =>
    sp.ten_dv.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h4>Quản lý Đơn Đặt</h4>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Mã Đơn</th>
            <th>Tên người đặt</th>
            <th>Ngày Tạo</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          {hoaDons.map(hoaDon => (
            <tr key={hoaDon.id} onClick={() => handleRowClick(hoaDon.id)}>
              <td>
                <input
                  type="radio"
                  name="hoadon"
                  onChange={() => handleRowClick(hoaDon.id)}
                  checked={selectedId === hoaDon.id}
                  onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện onClick của <tr>
                />
              </td>
              <td>{hoaDon.ma_hoa_don}</td>
              <td>{hoaDon.ten_nguoi_dat}</td>
              <td>{new Date(hoaDon.ngay_tao).toLocaleDateString()}</td>
              <td>{hoaDon.trangthai === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</td>
              <td>{hoaDon.tongtien}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form chi tiết hóa đơn */}
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
      {isFormOpen && (
        <div className="form-them-san-pham">
          <h5>Chọn Sản Phẩm</h5>
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
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSanPhams.map(product => (
                <tr key={product.id}>
                  <td style={{ textAlign: "center" }}><img
                  src={`http://localhost:8000/${product.image_dv}`}
                  alt={product.ten_dv}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    alignItems: "center",
                  }}
                /></td>
                  <td>{product.ten_dv}</td>
                  <td>{product.gia_dv}</td>
                  <td>
                    <button onClick={() => handleAddProduct(product)}>Thêm</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QLDonDat;
