import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';

export default function CommentSection({ product, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [supermarkets, setSupermarkets] = useState([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState('');
  const user = getUser();
  const isCustomer = user?.role === 'client';

  useEffect(() => {
    if (product?.id) {
      fetchComments();
      if (isCustomer) fetchSupermarkets();
    }
  }, [product?.id]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments?product_id=${product.id}`);
      setComments(res.data);
    } catch (err) {
      console.error('❌ שגיאה בשליפת תגובות:', err);
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const res = await api.get('/supermarkets');
      setSupermarkets(res.data);
    } catch (err) {
      console.error('❌ שגיאה בשליפת סופרים:', err);
    }
  };

  const handleSubmit = async () => {
    if (!text || !selectedSupermarket) return;

    const formData = new FormData();
    formData.append('text', text);
    formData.append('image_url', file);
    formData.append('product_id', product.id);
    formData.append('supermarket_id', selectedSupermarket);

    try {
      await api.post('/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      });
      setText('');
      setFile(null);
      setSelectedSupermarket('');
      fetchComments();
    } catch (err) {
      console.error('❌ שגיאה בשליחת תגובה:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      fetchComments();
    } catch (err) {
      console.error('❌ שגיאה במחיקת תגובה:', err);
    }
  };

  if (!product) return null;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.6)',
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: 20,
        maxWidth: 500,
        width: '90%',
        borderRadius: 10,
        position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>❌</button>
        <h3>
          💬 תגובות למוצר: {product?.name || 'לא ידוע'} • {product?.brand || ''} • {product?.quantity || ''}
        </h3>

        <div style={{ maxHeight: 300, overflowY: 'auto', marginTop: 10 }}>
          {comments.length === 0 ? (
            <p>אין תגובות עדיין.</p>
          ) : (
            comments.map((c, idx) => (
              <div key={idx} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
                <p>{c.text}</p>
                {c.image_url && (
                  <img
                    src={`http://localhost:5000/uploads/${c.image_url}`}
                    alt="comment"
                    style={{ maxWidth: '100%', maxHeight: 200 }}
                  />
                )}

                {user && c.user_id === user.id && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ color: 'red', marginTop: 5 }}
                  >
                    🗑️ מחק
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {isCustomer && (
          <>
            <hr />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="כתוב תגובה..."
              rows={3}
              style={{ width: '100%', marginTop: 10 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ marginTop: 5 }}
            />
            <select
              value={selectedSupermarket}
              onChange={(e) => setSelectedSupermarket(e.target.value)}
              style={{ marginTop: 10, width: '100%' }}
            >
              <option value="">בחר את הסופר ממנו קנית</option>
              {supermarkets.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button onClick={handleSubmit} style={{ marginTop: 10 }}>
              שלח תגובה
            </button>
          </>
        )}
      </div>
    </div>
  );
}
