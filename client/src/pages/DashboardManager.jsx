//  דשבורד למנהל סופר: מאפשר לערוך את המוצרים שלו ולראות מחירים של אחרים.

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';

export default function DashboardManager() {
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [supermarketId, setSupermarketId] = useState(null);


  const [form, setForm] = useState({
    name: '',
    brand: '',
    quantity: 1,
    price: 0,
    status: 'available'
  });

  const user = getUser();

   // שליפה של supermarket_id מהשרת
  useEffect(() => {
  const fetchSupermarketId = async () => {
    try {
      const res = await api.get(`/supermarkets/user/${user.id}`);
      setSupermarketId(res.data.id);
    } catch (err) {
      console.error('שגיאה בשליפת הסופרמרקט:', err);
    }
  };

  if (user?.id) fetchSupermarketId();
}, [user]);

  // שליפת מוצרים ותגובות רק לאחר שיש supermarket_id
  useEffect(() => {
    if (supermarketId) {
      fetchData();
    }
  }, [supermarketId]);

  const fetchData = async () => {
    try {
      const [prodsRes, commentsRes] = await Promise.all([
       api.get(`/products?supermarket_id=${supermarketId}`),
       api.get(`/comments?supermarket_id=${supermarketId}`)

      ]);
      setProducts(prodsRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('שגיאה בטעינת נתונים:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        supermarket_id: supermarketId  // ✅ זה חייב להיות כאן!
      };
      console.log('📦 נתונים להוספה:', newProduct);
      console.log('מוצר חדש שנשלח:', newProduct);
      console.log("user.supermarket_id:", supermarketId);
      await api.post('/products/add', newProduct);
      fetchData();
      setForm({ name: '', brand: '', quantity: 1, price: 0, status: 'available' });
    } catch (err) {
      console.error('שגיאה בהוספת מוצר:', err);
    }
  };


  return (
    <div>
      <h2>ניהול סופר – {user.name}</h2>

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
          <option value="available">זמין</option>
          <option value="limited">מוגבל</option>
          <option value="out_of_stock">לא זמין</option>
        </select>
        <button type="submit">הוסף</button>
      </form>

      <h3>המוצרים שלך</h3>
      <ul>
        {products.map((p, i) => (
          <li key={i}>
            {p.name} ({p.brand}) – ₪{p.price} × {p.quantity} [{p.status}]
          </li>
        ))}
      </ul>

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
