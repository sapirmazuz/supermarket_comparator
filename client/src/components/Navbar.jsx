// תפריט הניווט העליון לכל משתמש.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * קומפוננטת ניווט ראשית
 * מציגה קישורים לפי סוג המשתמש (לקוח או מנהל)
 */
const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>השוואת סופרמרקטים</h2>

      <div style={styles.links}>
        {/* ניווט ללקוחות */}
        {user?.role === 'client' && (
          <>
            <Link to="/compare" style={styles.link}>רשימת סופרים</Link>
            <Link to="/products?view=catalog" style={styles.link}>מוצרים</Link>
            <Link to="/products?view=cart" style={styles.link}>העגלה שלי</Link>
          </>
        )}

        {/* ניווט למנהלים */}
        {user?.role === 'manager' && (
          <>
            <Link to="/dashboard?view=assign" style={styles.link}>שיוך מוצרים</Link>
            <Link to="/dashboard?view=manage" style={styles.link}>ניהול המוצרים שלי</Link>
          </>
        )}

        {/* התחברות/התנתקות */}
        {user ? (
          <button onClick={handleLogout} style={styles.button}>התנתק</button>
        ) : (
          <Link to="/login" style={styles.link}>התחבר</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#f4f4f4',
    borderBottom: '1px solid #ccc'
  },
  logo: {
    margin: 0,
    color: '#333'
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  link: {
    textDecoration: 'none',
    color: '#0077cc',
    fontWeight: 'bold'
  },
  button: {
    padding: '5px 10px',
    background: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navbar;
