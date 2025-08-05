// עמוד התחברות עבור כל סוגי המשתמשים.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { login as saveLogin } from '../services/auth';
import { Link } from 'react-router-dom';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/users/login', { email, password });
      const { token, user } = res.data;

      localStorage.removeItem('user');

      // שמירת התחברות
      saveLogin(user, token);

      // ניווט לפי role
      if (user.role === 'manager') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/products';
      }

    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בהתחברות');
    }
  };

  return (
    <div>
      <h2>התחברות</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>אימייל:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>סיסמה:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">התחבר</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
       <p style={{ marginTop: '10px' }}>
      אין לך חשבון? <Link to="/Register">להרשמה</Link>
    </p>
    </div>
    
  );
}
