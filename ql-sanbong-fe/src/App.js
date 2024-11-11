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
import ProtectedRoute from "./PrivateRoute";
function App() {
  return (
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
        
        {/* Protected Routes */}
        <Route
          path="/thanh-toan"
          element={
            <PrivateRoute>
              <ThanhToan />
            </PrivateRoute>
          }
        />
         <Route
          path="/admin"
          element={
            <ProtectedRoute element={<NhanVienPage />} requiredRole="admin" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
