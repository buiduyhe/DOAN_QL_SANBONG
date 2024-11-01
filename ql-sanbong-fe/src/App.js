import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm'; // Đường dẫn tới file LoginForm
import RegisterForm from './RegisterForm'; // Đường dẫn tới file RegisterForm
import Home from './page/Home/Home';
import Product from './page/Product/Product';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />}/>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/product" element = {<Product/>}/>
      </Routes>
    </Router>
  );
}

export default App;
