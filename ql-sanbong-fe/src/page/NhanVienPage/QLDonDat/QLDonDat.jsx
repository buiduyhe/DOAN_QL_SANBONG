import React, { useEffect, useState } from "react";
import "../QL.scss";
import SearchBar from "../../Admin/SearchBar/SearchBar"; // Import SearchBar component

const QLDonDat = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [chiTietHoaDon, setChiTietHoaDon] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("ma_hoa_don"); // Trường tìm kiếm mặc định là mã đơn
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);

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

    if (selectedId) {
      fetchChiTietHoaDon(selectedId);
    }
  };

  const handleRowClick = (hoaDon) => {
    setSelectedId(hoaDon.id);
    setSelectedHoaDon(hoaDon);
    fetchChiTietHoaDon(hoaDon.id);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };

  const handleAddProduct = (product) => {
    if (!selectedId) {
      alert("Vui lòng chọn hóa đơn trước khi thêm sản phẩm!");
      return;
    }

    const quantity = quantities[product.id] || 0;

    if (quantity <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ!");
      return;
    }

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.id]: 0,
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
        console.log("Response from API:", data);

        if (data.success) {
          setChiTietHoaDon([
            ...chiTietHoaDon,
            { ...product, soluong: quantity },
          ]);
          setIsFormOpen(false);
          alert(data.message);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Có lỗi khi thêm sản phẩm!");
      });
  };

  const handlePayment = () => {
    if (!selectedId) {
      alert("Vui lòng chọn hóa đơn trước khi thanh toán!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn thanh toán hóa đơn này?")) {
      fetch(`http://127.0.0.1:8000/san/in_hoadon_excel?hoa_don_id=${selectedId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `hoadon_${selectedId}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          refreshData();
        })
        .catch((error) => {
          console.error("Error printing invoice:", error);
          alert("Có lỗi khi in hóa đơn!");
        });
    }
  };
  const filteredSanPhams = sanPhams.filter((sp) =>
    sp.ten_dv.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Lọc dữ liệu hoaDons theo searchTerm và searchField
  const filteredHoaDons = hoaDons.filter((hoaDon) => {
    const searchValue = hoaDon[searchField]?.toString().toLowerCase();
    return searchValue && searchValue.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h4>Quản lý Đơn Đặt</h4>

      {/* Thanh tìm kiếm */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchField={searchField}
        setSearchField={setSearchField}
        searchLabel="Đơn Đặt"
        searchOptions={[
          { value: "ma_hoa_don", label: "Tìm kiếm theo mã đơn" },
          { value: "ten_nguoi_dat", label: "Tìm kiếm theo email người đặt" },
        ]}
      />

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Đơn</th>
            <th>Email người đặt</th>
            <th>Ngày Tạo</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          {filteredHoaDons.map((hoaDon) => (
            <tr
              key={hoaDon.id}
              onClick={() => handleRowClick(hoaDon)}
              className={hoaDon.trangthai === 1 ? "paid" : ""}
            >
              <td>
                <input
                  type="radio"
                  name="hoadon"
                  checked={selectedId === hoaDon.id}
                  onChange={() => handleRowClick(hoaDon)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginRight: "5px" }}
                />{hoaDon.STT}
              </td>
              <td>{hoaDon.ma_hoa_don}</td>
              <td>{hoaDon.ten_nguoi_dat}</td>
              <td>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                }).format(new Date(hoaDon.ngay_tao))}
              </td>
              <td>
                {hoaDon.trangthai === 0 ? "Chưa thanh toán" : "Đã thanh toán"}
              </td>
              <td>{hoaDon.tongtien}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
            <button
              onClick={() => setIsFormOpen(true)}
              disabled={selectedHoaDon?.trangthai !== 0}
            >
              Thêm Sản Phẩm
            </button>
          <button onClick={handlePayment} disabled={selectedHoaDon?.trangthai !== 0}>
            Thanh Toán
          </button>
          </div>
        </div>
      )}
      
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
                      value={quantities[product.id] || 0}
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
                    <button onClick={() => handleAddProduct(product)}>
                      Thêm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="btn-actions">
            <button
              onClick={() => {
                refreshData();
                setIsFormOpen(false);
              }}
            >
              Thoát
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default QLDonDat;
