import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';

export default function CommentSection({ product, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const user = getUser();
  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    if (product?.id) {
      fetchComments();
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

  const handleSubmit = async () => {
    if (!text && !file) return;

    const formData = new FormData();
    formData.append('comment', text);
    formData.append('image', file);
    formData.append('product_id', product.id);

    try {
      await api.post('/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      });
      setText('');
      setFile(null);
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

  if (!product) return null; // לא מציג את המודאל אם אין מוצר

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
                <p>{c.comment}</p>
                {c.image && (
                  <img
                    src={`/uploads/${c.image}`}
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
            <button onClick={handleSubmit} style={{ marginTop: 10 }}>
              שלח תגובה
            </button>
          </>
        )}
      </div>
    </div>
  );
}
