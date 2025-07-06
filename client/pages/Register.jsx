import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { login as saveLogin } from '../services/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/users/register', { name, email, password, role });

      // התחברות אוטומטית אחרי רישום
      const loginRes = await api.post('/users/login', { email, password });
      const { token, user } = loginRes.data;
      saveLogin(user, token);

      if (user.role === 'manager') {
        navigate('/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בהרשמה');
    }
  };

  return (
    <div>
      <h2>הרשמה</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>שם:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>אימייל:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>סיסמה:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>תפקיד:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">לקוח</option>
            <option value="manager">מנהל סופר</option>
          </select>
        </div>
        <button type="submit">הרשמה</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
