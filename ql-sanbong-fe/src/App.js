import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm'; // Đường dẫn tới file LoginForm
import RegisterForm from './RegisterForm'; // Đường dẫn tới file RegisterForm
import Home from './page/Home/Home';
import Product from './page/Product/Product';
import LienHe from './page/LienHe/LienHe';
import GioiThieu from './page/GioiThieu/GioiThieu';
import DatSan from './page/DatSan/DatSan';
import ThanhToan from './page/DatSan/ThanhToan/ThanhToan';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />}/>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/product" element = {<Product/>}/>
        <Route path="/LienHe" element = {<LienHe/>}/>
        <Route path="/gioithieu" element = {<GioiThieu/>}/>
        <Route path="/DatSan" element = {<DatSan/>}/>
        <Route path="/thanh-toan" element = {<ThanhToan/>}/>
      </Routes>
    </Router>
  );
}

export default App;
