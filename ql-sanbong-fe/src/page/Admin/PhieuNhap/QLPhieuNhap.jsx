import React, { useState, useEffect } from 'react';
import './QLPhieuNhap.scss';

const QLPhieuNhap = () => {
  const [data, setData] = useState([]); 
  const [suppliers, setSuppliers] = useState([]); 
  const [selectedRow, setSelectedRow] = useState(null); 
  const [receiptDetails, setReceiptDetails] = useState([]); 
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newReceiptData, setNewReceiptData] = useState([]); 
  const [showForm, setShowForm] = useState(false); 

  useEffect(() => {
    fetch('http://localhost:8000/Ncc/Ncc')
      .then((response) => response.json())
      .then((data) => setSuppliers(data));

    fetch('http://localhost:8000/dichvu/dichvu')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/Ncc/get-all-nhap-hang')
      .then((response) => response.json())
      .then((data) => {
        setData(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setData([]);
      });
  }, []);

  const getSupplierName = (id) => {
    const supplier = suppliers.find((sup) => sup.id === id);
    return supplier ? supplier.ten_ncc : 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Duyệt';
      case 2:
        return 'Từ chối';
      case 0:
        return 'Chưa duyệt';
      default:
        return 'Không xác định';
    }
  };

  const handleRowClick = (id) => {
    setSelectedRow(id);
    fetchReceiptDetails(id);
  };

  const fetchReceiptDetails = (id) => {
    fetch(`http://localhost:8000/Ncc/chi-tiet-nhap-hang/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setReceiptDetails(data.chi_tiet || []); // Save receipt details to state
      })
      .catch((error) => {
        console.error('Error fetching receipt details:', error);
        setReceiptDetails([]); // Fallback to empty array in case of error
      });
  };

  const getProductName = (id) => {
    const product = products.find((prod) => prod.id === id);
    return product ? product.ten_dv : 'Unknown Product';
  };

  const getRowStyle = (status) => {
    switch (status) {
      case 1:
        return { backgroundColor: 'lightgreen' };
      case 2:
        return { backgroundColor: 'lightcoral' };
      default:
        return {};
    }
  };

  const handleDuyet = () => {
    if (selectedRow !== null) {
      fetch(`http://localhost:8000/Ncc/nhap-hang/${selectedRow}/duyet`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then(() => {
          alert('Đơn đã được duyệt');
          fetchData();
        })
        .catch((error) => {
          console.error('Error approving:', error);
        });
    } else {
      alert('Vui lòng chọn đơn hàng');
    }
  };

  const handleTuChoiDuyet = () => {
    if (selectedRow !== null) {
      fetch(`http://localhost:8000/Ncc/nhap-hang/${selectedRow}/tuchoiduyet`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then(() => {
          alert('Đơn đã bị từ chối');
          fetchData();
        })
        .catch((error) => {
          console.error('Error rejecting:', error);
        });
    } else {
      alert('Vui lòng chọn đơn hàng');
    }
  };
  const handleInPhieuNhap = () => {
    if (selectedRow !== null) {
      fetch(`http://127.0.0.1:8000/Ncc/in_hoadon_nhap_excel?nhap_hang_id=${selectedRow}`, {
        method: 'POST',
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `phieu_nhap_${selectedRow}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch((error) => {
          console.error('Error printing receipt:', error);
        });
    } else {
      alert('Vui lòng chọn đơn hàng');
    }
  };
  const fetchData = () => {
    fetch('http://localhost:8000/Ncc/get-all-nhap-hang')
      .then((response) => response.json())
      .then((data) => {
        setData(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setData([]);
      });
  };

  const handleRadioChange = (id) => {
    setSelectedRow(id);
  };

  // Handle selecting a supplier and fetching corresponding products/services
  const handleSupplierChange = (event) => {
    const supplierId = event.target.value;
    setSelectedSupplier(supplierId);
  };


  // Handle form submission to add new receipt
  const handleSubmitReceipt = () => {
    if (!selectedSupplier) {
      alert('Vui lòng chọn nhà cung cấp');
      return;
    }

    const receiptData = newReceiptData.map(item => ({
      id_dv: String(item.id_dv),
      soluong: item.soluong,
      don_gia: item.don_gia,
    }));

    fetch(`http://localhost:8000/Ncc/nhap-hang?ncc_id=${Number(selectedSupplier)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Phiếu nhập hàng đã được thêm');
        setShowForm(false); // Hide the form after submission
        setNewReceiptData([]); // Clear new receipt data
        fetchData(); // Refresh the data
      })
      .catch((error) => {
        console.error('Error adding receipt:', error);
      });
  };
  const handleCancel = () => {
    setShowForm(false); // Đóng form khi nhấn hủy
    setSelectedSupplier(null); // Reset nhà cung cấp đã chọn
    setNewReceiptData([{ id_dv: '', soluong: 0, don_gia: 0 }]); // Reset dữ liệu phiếu nhập
  };

  return (
    <div>
      <h1>Quản lý phiếu nhập</h1>

      {/* Show form for adding new receipt */}
      
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên nhà cung cấp</th>
            <th>Trạng thái</th>
            <th>Ngày nhập</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => handleRowClick(item.id)}
              style={{
                cursor: 'pointer',
                ...getRowStyle(item.trang_thai),
              }}
            >
              <td>
                <input
                  type="radio"
                  name="selectedRow"
                  checked={selectedRow === item.id}
                  onChange={() => handleRadioChange(item.id)}
                />
                {index + 1}
              </td>
              <td>{getSupplierName(item.ncc_id)}</td>
              <td>{getStatusText(item.trang_thai)}</td>
              <td>{formatDate(item.ngay_nhap)}</td>
              <td>{item.tong_tien.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render the detailed receipt data if a row is selected */}
      {selectedRow !== null && receiptDetails.length > 0 && (
        <div>
          <h2>Chi tiết phiếu nhập</h2>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {receiptDetails.map((item) => (
                <tr key={item.STT}>
                  <td>{item.STT}</td>
                  <td>{getProductName(item.id_dv)}</td>
                  <td>{item.soluong}</td>
                  <td>{item.don_gia.toLocaleString()}</td>
                  <td>{item.thanhtien.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="button-container"></div>
      <div className="button-container">
        {selectedRow !== null && data.some(item => item.id === selectedRow && (item.trang_thai === 1 || item.trang_thai === 2)) ? (
          <div>
            <button className="button duyet" disabled>Duyệt Đơn</button>
            <button className="button tuchoi" disabled>Từ Chối Duyệt</button>
            <button className="button them" onClick={() => setShowForm(true)}>
              Tạo Phiếu Nhập Hàng
            </button>
            <button className="button them" onClick={handleInPhieuNhap} >
              In Phiếu Nhập Hàng
            </button>
          </div>
        ) : (
          <div>
            <button className="button duyet" onClick={handleDuyet}>Duyệt Đơn</button>
            <button className="button tuchoi" onClick={handleTuChoiDuyet}>Từ Chối Đơn</button>
            <button className="button them" onClick={() => setShowForm(true)}>
              Tạo Phiếu Nhập Hàng
            </button>
            
          </div>

        )}
        {showForm && (
        <div className="form-container">
          <h2>Chọn Nhà Cung Cấp</h2>
          <select onChange={handleSupplierChange} value={selectedSupplier}>
            <option value="">Chọn nhà cung cấp</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.ten_ncc}
              </option>
            ))}
          </select>
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
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>

              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
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
                      <td>{(product.gia_dv * 0.8)}</td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          value={newReceiptData.find(item => item.id_dv === product.id)?.soluong || 0}
                          onChange={(e) =>
                            setNewReceiptData((prevData) => {
                              const updatedData = prevData.map(item =>
                                item.id_dv === product.id
                                  ? { ...item, soluong: Number(e.target.value) }
                                  : item
                              ).filter(item => item.soluong > 0);
                              return updatedData;
                            })
                          }
                          style={{
                            width: "50px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                      <td>
                      <button
                        onClick={() => {
                          setNewReceiptData(prevData => {
                            const productInCart = prevData.find(item => item.id_dv === product.id);
                            if (productInCart) {
                              // Nếu sản phẩm đã tồn tại, tăng số lượng
                              return prevData.map(item =>
                                item.id_dv === product.id
                                  ? { ...item, soluong: item.soluong + 1 }
                                  : item
                              );
                            } else {
                              // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
                              return [
                                ...prevData,
                                { id_dv: product.id, soluong: 1, don_gia: product.gia_dv * 0.8 }
                              ];
                            }
                          });
                        }}
                      >
                        Thêm
                      </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>Chưa có sản phẩm nào</td>
                  </tr>
                )}
              </tbody>
          </div>

            </table>
          {/* Show receipt details form after supplier is selected */}
          
          <h3>Danh sách sản phẩm</h3>
          <table>
            <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
              <th>Thao tác</th>
            </tr>
            </thead>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>

            <tbody>
            {newReceiptData.map((item, index) => {
              const product = products.find((prod) => prod.id === item.id_dv);
              if (!product) return null;
              return (
              <tr key={index}>
                <td>{product.ten_dv}</td>
                <td>{item.soluong}</td>
                <td>{item.don_gia.toLocaleString()}</td>
                <td>{(item.soluong * item.don_gia).toLocaleString()}</td>
                <td>
                  <button onClick={() => {
                    setNewReceiptData(prevData => prevData.filter((_, i) => i !== index));
                  }}>
                    X
                  </button>
                </td>
              </tr>
              );
            })}
            </tbody>
          </div>

          </table>
          <div className="cart-total">
            <strong>Tổng tiền: </strong>
            {newReceiptData.reduce((total, item) => total + item.soluong * item.don_gia, 0).toLocaleString()}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSubmitReceipt}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          Thêm Phiếu Nhập
        </button>
        <button
          onClick={handleCancel}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#f44336",
            color: "white",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
        >
          Hủy
        </button>
      </div>

        </div>
        
      )}
      </div>
    </div>
  );
};

export default QLPhieuNhap;
