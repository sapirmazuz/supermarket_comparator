// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { login as saveLogin } from '../services/auth';
import '../css/register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [supermarketName, setSupermarketName] = useState('');
  const [supermarketAddress, setSupermarketAddress] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/users/register', {
        name,
        email,
        password,
        role,
        supermarketName: role === 'manager' ? supermarketName : undefined,
        supermarketAddress: role === 'manager' ? supermarketAddress : undefined,
      });

      // התחברות אוטומטית אחרי רישום
      const loginRes = await api.post('/users/login', { email, password });
      const { token, user } = loginRes.data;
      saveLogin(user, token);

      navigate(user.role === 'manager' ? '/dashboard' : '/products');
    } catch (err) {
      setError(err?.response?.data?.error || 'שגיאה בהרשמה');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h1 className="auth-title">יצירת חשבון</h1>
        <p className="auth-sub">פתחי חשבון חדש והתחילי להשוות מחירים</p>

        <form className="auth-form" onSubmit={handleRegister} noValidate>
          <div className="field">
            <label>שם מלא</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* בחירת תפקיד – טוגל מעוצב */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'client' ? 'active' : ''}`}
              onClick={() => setRole('client')}
            >
              לקוח
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'manager' ? 'active' : ''}`}
              onClick={() => setRole('manager')}
            >
              מנהל סופר
            </button>
          </div>

          {/* שדות לסוג מנהל בלבד */}
          {role === 'manager' && (
            <div className="grid-2">
              <div className="field">
                <label>שם הסופרמרקט</label>
                <input
                  type="text"
                  value={supermarketName}
                  onChange={(e) => setSupermarketName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>כתובת הסופרמרקט</label>
                <input
                  type="text"
                  value={supermarketAddress}
                  onChange={(e) => setSupermarketAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {error && <div className="alert error">{error}</div>}

          <button type="submit" className="submit" disabled={submitting}>
            {submitting ? 'נרשם…' : 'הרשמה'}
          </button>

          <div className="auth-footer">
            כבר יש לך חשבון? <Link to="/login">להתחברות</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
