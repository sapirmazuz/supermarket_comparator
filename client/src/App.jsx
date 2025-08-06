//  רכיב השורש הראשי; מגדיר נתיבים (<Routes>) ומבנה בסיסי של

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Compare from './pages/Compare';
import DashboardManager from './pages/DashboardManager';
import Navbar from './components/Navbar'; // 👉 ייבוא ה־Navbar
import React, { useEffect, useState } from 'react';


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
const [user, setUser] = useState(null); // ⬅️ התחלה ריקה
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // ⬅️ סיום טעינה
  }, []);

  if (loading) return null; // ⬅️ לא מרנדר כלום עד סיום

  return (
    <Router>
      <LayoutWithNavbar>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Navigate to="/products" />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/compare" element={<Compare />} />
          <Route
            path="/dashboard"
            element={user?.role === 'manager' ? <DashboardManager /> : <Navigate to="/products" />}
          />
           <Route path="*" element={<Navigate to="/" />} /> {/* ברירת מחדל */}
        </Routes>
      </LayoutWithNavbar>
    </Router>
  );
}

export default App;
