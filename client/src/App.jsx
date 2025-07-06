import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Compare from './pages/Compare';
import DashboardManager from './pages/DashboardManager';
import Navbar from './components/Navbar'; // 👉 ייבוא ה־Navbar

// קומפוננטת עטיפה שמציגה את ה־Navbar בכל העמודים למעט login/register
function LayoutWithNavbar({ children }) {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <LayoutWithNavbar>
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/dashboard" element={user?.role === 'manager' ? <DashboardManager /> : <Navigate to="/products" />} />
        </Routes>
      </LayoutWithNavbar>
    </Router>
  );
}

export default App;
