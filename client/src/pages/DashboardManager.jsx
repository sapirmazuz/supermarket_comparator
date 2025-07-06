import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth'; // פונקציה שמביאה את המשתמש המחובר

export default function DashboardManager() {
  // מצב עבור רשימת מוצרים של הסופר
  const [products, setProducts] = useState([]);

  // מצב עבור תגובות שנכתבו על הסופר
  const [comments, setComments] = useState([]);

  // מצב עבור הטופס של הוספת מוצר חדש
  const [form, setForm] = useState({
    name: '',
    brand: '',
    quantity: 1,
    price: 0,
    status: 'active'
  });

  // שליפת פרטי המשתמש המחובר (המנהל)
  const user = getUser();

  // קריאה לשרת בטעינה ראשונית של העמוד
  useEffect(() => {
    fetchData();
  }, []);

  // פונקציה שמביאה את המוצרים והתגובות מהשרת
  const fetchData = async () => {
    try {
      const [prodsRes, commentsRes] = await Promise.all([
        api.get(`/products?supermarket_id=${user.id}`),
        api.get(`/comments?supermarket_id=${user.id}`)
      ]);
      setProducts(prodsRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('שגיאה בטעינת נתונים:', err);
    }
  };

  // שינוי ערכים בטופס
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // שליחה של הטופס לשרת והוספת מוצר
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        supermarket_id: user.id // קישור המוצר לסופר של המנהל
      };
      await api.post('/products', newProduct);
      fetchData(); // טען מחדש את הנתונים לאחר הוספה
      // אפס את הטופס
      setForm({ name: '', brand: '', quantity: 1, price: 0, status: 'active' });
    } catch (err) {
      console.error('שגיאה בהוספת מוצר:', err);
    }
  };

  return (
    <div>
      <h2>ניהול סופר – {user.name}</h2>

      {/* טופס להוספת מוצר חדש */}
      <h3>הוסף מוצר חדש</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="שם מוצר"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="brand"
          placeholder="מותג"
          value={form.brand}
          onChange={handleChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="כמות"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="מחיר"
          value={form.price}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">פעיל</option>
          <option value="inactive">לא פעיל</option>
        </select>
        <button type="submit">הוסף</button>
      </form>

      {/* תצוגת כל המוצרים של הסופר */}
      <h3>המוצרים שלך</h3>
      <ul>
        {products.map((p, i) => (
          <li key={i}>
            {p.name} ({p.brand}) – ₪{p.price} × {p.quantity} [{p.status}]
          </li>
        ))}
      </ul>

      {/* תצוגת תגובות של לקוחות */}
      <h3>תגובות לקוחות</h3>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>
            <strong>{c.user_name}</strong>: {c.content}
            {c.image_url && (
              <div>
                <img src={c.image_url} alt="תגובה" width="100" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
