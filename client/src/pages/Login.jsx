// client/src/pages/Login.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { login as saveLogin } from '../services/auth';
import '../css/register.css'; // ← משתמשים באותו CSS של ההרשמה

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/users/login', { email, password });
      const { token, user } = res.data;

      localStorage.removeItem('user'); // נשאר כמו שהיה אצלך
      saveLogin(user, token);          // שמירת התחברות

      // כדי לא לשנות את הזרימה שלך – רענון וניווט לעמוד הבית
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בהתחברות');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h1 className="auth-title">התחברות</h1>
        <p className="auth-sub">ברוכה הבאה — התחברי לחשבון שלך</p>

        <form className="auth-form" onSubmit={handleLogin}>
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

          {error && <div className="alert error">{error}</div>}

          <button type="submit" className="submit" disabled={submitting}>
            {submitting ? 'מתחברת…' : 'התחבר'}
          </button>

          <div className="auth-footer">
            אין לך חשבון? <Link to="/register">להרשמה</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
