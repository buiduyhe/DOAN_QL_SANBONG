import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Home from "./page/Home/Home";
import Product from "./page/Product/Product";
import LienHe from "./page/LienHe/LienHe";
import GioiThieu from "./page/GioiThieu/GioiThieu";
import DatSan from "./page/DatSan/DatSan";
import ThanhToan from "./page/DatSan/ThanhToan/ThanhToan";
import NhanVienPage from "./page/NhanVienPage/NhanVienPage";
import PrivateRoute from "./PrivateRoute";
import Admin from "./page/Admin/Admin";
import GioHang from "./page/GioHang/GioHang";
import { CartProvider } from './CartContext';  // Import CartProvider
import Checkout from "./page/GioHang/ThanhToan/Checkout";
import ChangePasswordForm from "./ChangePasswordForm";

function App() {
  return (
    <CartProvider>  {/* Bao quanh toàn bộ ứng dụng để giỏ hàng có thể được truy cập từ bất kỳ đâu */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/LienHe" element={<LienHe />} />
          <Route path="/gioithieu" element={<GioiThieu />} />
          <Route path="/DatSan" element={<DatSan />} />
          <Route path="/cart" element={<GioHang />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thanh-toan" element={<ThanhToan />} />
          <Route path="/change-password" element={<ChangePasswordForm/>}/>

          {/* Protected Routes */}
          <Route path="/admin" element={<PrivateRoute allowedRole="admin"><NhanVienPage /></PrivateRoute>} />
          <Route path="/supadmin" element={<PrivateRoute allowedRole="supadmin"><Admin /></PrivateRoute>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
