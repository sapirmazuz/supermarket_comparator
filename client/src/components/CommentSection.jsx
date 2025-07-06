import React, { useEffect, useState } from 'react';
import axios from 'axios';

// קומפוננטה שמציגה את התגובות עבור סופר מסוים
const CommentSection = ({ supermarketId, user }) => {
  const [comments, setComments] = useState([]); // התגובות הקיימות
  const [content, setContent] = useState('');   // תוכן התגובה החדשה
  const [image, setImage] = useState(null);     // קובץ התמונה לתגובה

  // טוען את כל התגובות מהשרת כשנטען הקומפוננט
  useEffect(() => {
    if (supermarketId) {
      fetchComments();
    }
  }, [supermarketId]);

  // מביא תגובות לפי supermarket_id
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments?supermarket_id=${supermarketId}`);
      setComments(res.data);
    } catch (err) {
      console.error('שגיאה בשליפת תגובות:', err);
    }
  };

  // שינוי קובץ התמונה
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // שליחת תגובה חדשה לשרת
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('user_id', user.id); // מזהה המשתמש
      formData.append('supermarket_id', supermarketId); // מזהה הסופר
      formData.append('content', content); // תוכן הטקסט
      if (image) {
        formData.append('image', image); // קובץ תמונה אם נבחר
      }

      // שליחת הבקשה לשרת
      await axios.post('/api/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setContent('');
      setImage(null);
      fetchComments(); // רענון רשימת התגובות לאחר השליחה
    } catch (err) {
      console.error('שגיאה בהוספת תגובה:', err);
    }
  };

  return (
    <div className="comment-section">
      <h3>תגובות על הסופר</h3>

      {/* טופס לשליחת תגובה חדשה */}
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="כתוב תגובה..."
            required
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="submit">שלח תגובה</button>
        </form>
      )}

      {/* הצגת כל התגובות */}
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.user_name}:</strong> {comment.content}
            {comment.image_url && (
              <div>
                <img
                  src={`/uploads/${comment.image_url}`}
                  alt="תגובה"
                  style={{ maxWidth: '200px', marginTop: '5px' }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
