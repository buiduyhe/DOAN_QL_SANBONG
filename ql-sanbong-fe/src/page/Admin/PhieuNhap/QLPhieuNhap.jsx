import React, { useState, useEffect } from 'react';
import './QLPhieuNhap.scss'; // Import SCSS file

const QLPhieuNhap = () => {
  const [data, setData] = useState([]); // For receipt data
  const [suppliers, setSuppliers] = useState([]); // For supplier data
  const [selectedRow, setSelectedRow] = useState(null); // For tracking the selected row
  const [receiptDetails, setReceiptDetails] = useState([]); // For storing the receipt details
  const [products, setProducts] = useState([]); // For storing product data
  const [selectedSupplier, setSelectedSupplier] = useState(null); // For tracking selected supplier
  const [newReceiptData, setNewReceiptData] = useState([{ id_dv: '', soluong: 0, don_gia: 0 }]); // For new receipt form data
  const [showForm, setShowForm] = useState(false); // For showing the form after clicking "Thêm Phiếu Nhập Hàng"

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
    fetchProductsForSupplier(supplierId); // Fetch products for selected supplier
  };

  const fetchProductsForSupplier = (supplierId) => {
    fetch(`http://localhost:8000/Ncc/nhap-hang/?ncc_id=${supplierId}`)
      .then((response) => response.json())
      .then((data) => {
        setNewReceiptData(data.map((item) => ({
          id_dv: item.id_dv,
          soluong: 0,
          don_gia: 0,
        })));
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  // Handle form submission to add new receipt
  const handleSubmitReceipt = () => {
    const receiptData = {
      ncc_id: selectedSupplier,
      details: newReceiptData,
    };

    fetch('http://localhost:8000/Ncc/nhap-hang/', {
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

      <div className="button-container">
        {selectedRow !== null && data.some(item => item.id === selectedRow && (item.trang_thai === 1 || item.trang_thai === 2)) ? (
          <div>
            <button className="button duyet" disabled>Duyệt Đơn</button>
            <button className="button tuchoi" disabled>Từ Chối Duyệt</button>
          </div>
        ) : (
          <div>
            <button className="button duyet" onClick={handleDuyet}>Duyệt Đơn</button>
            <button className="button tuchoi" onClick={handleTuChoiDuyet}>Từ Chối Duyệt</button>
            <button className="button them" onClick={() => setShowForm(true)}>
              Thêm Phiếu Nhập Hàng
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

          {/* Show receipt details form after supplier is selected */}
          {selectedSupplier && newReceiptData.length > 0 && (
            <div>
              <h3>Nhập thông tin phiếu nhập</h3>
              {newReceiptData.map((item, index) => (
                <div key={index} className="receipt-item">
                  <label>Tên dịch vụ:</label>
                  <select
                    value={item.id_dv}
                    onChange={(e) =>
                      setNewReceiptData((prevData) => {
                        const updatedData = [...prevData];
                        updatedData[index].id_dv = e.target.value;
                        return updatedData;
                      })
                    }
                  >
                    <option value="">Chọn dịch vụ</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.ten_dv}
                      </option>
                    ))}
                  </select>

                  <label>Số lượng:</label>
                  <input
                    type="number"
                    value={item.soluong}
                    onChange={(e) =>
                      setNewReceiptData((prevData) => {
                        const updatedData = [...prevData];
                        updatedData[index].soluong = parseInt(e.target.value);
                        return updatedData;
                      })
                    }
                  />

                  <label>Đơn giá:</label>
                  <input
                    type="number"
                    value={item.don_gia}
                    onChange={(e) =>
                      setNewReceiptData((prevData) => {
                        const updatedData = [...prevData];
                        updatedData[index].don_gia = parseInt(e.target.value);
                        return updatedData;
                      })
                    }
                  />
                </div>
              ))}
              <button className="button" onClick={handleSubmitReceipt}>
                Thêm Phiếu Nhập
              </button>
              <button className="button cancel" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default QLPhieuNhap;
