import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
// import { useLocation } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import '../css/products.css';
import { useLocation, useNavigate } from 'react-router-dom';
import cartIcon from '../assets/cart.png';

export default function DashboardManager() {
  const [catalog, setCatalog] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [myProducts, setMyProducts] = useState([]);
  const [editStates, setEditStates] = useState({});
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const user = getUser();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const view = params.get('view'); // ⬅️ הוסף את זה
  const category = params.get('category'); // ⬅️ כבר יש לך את זה
  const navigate = useNavigate();
  const [assignedIds, setAssignedIds] = useState(new Set());



useEffect(() => {
  if (view === 'assign') {
    api.get('/products', { params: category ? { category } : {} })
      .then(res => setCatalog(res.data))
      .catch(() => setMessage('שגיאה בטעינת הקטלוג'));
  } else if (view === 'manage') {
    if (!user || user.role !== 'manager') return; // הימנעות מקריאה שתגרום ל-403
    api.get('/products/my')
      .then(res => setMyProducts(res.data))
      .catch(err => {
        const status = err?.response?.status;
        setMessage(status === 403 ? 'אין הרשאה (התחברי כמנהל)' : 'שגיאה בטעינת המוצרים שלך');
      });
  }
}, [view, category]);

  const updateProduct = async (product_id, newPrice, newStatus) => {
    try {
      await api.put(`/products/my/${product_id}`, {
        price: newPrice,
        status: newStatus
      });
      setMyProducts(prev =>
        prev.map(p =>
          p.product_id === product_id ? { ...p, price: newPrice, status: newStatus } : p
        )
      );
      setMessage('✔️ המוצר עודכן בהצלחה');
    } catch (err) {
      setMessage('❌ שגיאה בעדכון המוצר');
    }
  };

  const deleteProduct = async (product_id) => {
    try {
      await api.delete(`/products/my/${product_id}`);
      setMyProducts(prev => prev.filter(p => p.product_id !== product_id));
      setMessage('🗑️ המוצר נמחק בהצלחה');
    } catch (err) {
      setMessage('❌ שגיאה במחיקת המוצר');
    }
  };

// טוענים רשימת מוצרים ששויכו למנהל כדי לזהות כפילויות (רץ פעם כשיש מנהל מחובר)
useEffect(() => {
  if (user?.role === 'manager') {
    api.get('/products/my')
      .then(res => {
        // לא חייבים לדרוס את myProducts כאן; העיקר לייצר את הסט לזיהוי כפילויות
        const ids = new Set(res.data.map(p => p.product_id));
        setAssignedIds(ids);
      })
      .catch(() => {/* שקט – לא מפריעים לזרימה */});
  }
}, [user?.role]);

// בדיקת כפילות לפני שיוך
const handleAssignProduct = async (product_id) => {
  const { price, status } = assignments[product_id] || {};
  if (!price || !status) {
    setMessage('יש להזין מחיר וזמינות');
    return;
  }

  // 👇 חסימת כפילות בצד לקוח
  if (assignedIds.has(product_id)) {
    setMessage('⚠️ המוצר כבר שויך לסופר שלך. ניתן לעדכן אותו במסך "ניהול המוצרים שלך".');
    return;
  }

  try {
    await api.post('/products/assign', { product_id, price, status });
    setMessage('✔️ המוצר שויך בהצלחה');
    // מוסיפים מיידית כדי לחסום לחיצות נוספות
    setAssignedIds(prev => new Set(prev).add(product_id));
    // אופציונלי: לרענן לגמרי את רשימת המוצרים המשוייכים
    // const res = await api.get('/products/my');
    // setAssignedIds(new Set(res.data.map(p => p.product_id)));
  } catch (error) {
    setMessage('❌ שגיאה בשיוך המוצר');
  }
};

return (
  <div className={view === 'assign' ? 'catalog' : 'p-4'}>
    {view === 'assign' ? (
      <>
        <div className="catalog-header">
  <div className="search">
    <input
      type="text"
      placeholder="🔍 חפש מוצר או מותג..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  <div className="quick-actions">
    <button
      className="qa-btn"
      onClick={() => navigate('/dashboard?view=manage')}
      title="המוצרים שלי"
    >
      <img src={cartIcon} alt="המוצרים שלי" />
      <span>המוצרים שלי</span>
    </button>

    <button
      className="qa-btn"
      onClick={() => navigate('/')}
      title="חזרה לבית"
    >
      <span className="qa-back" aria-hidden>↩</span>
      <span>חזור</span>
    </button>
  </div>
</div>


        <h2 className="text-xl font-bold" style={{ margin: '8px 0 12px' }}>
          🛒 שיוך מוצרים לסופר שלך
          {category ? (
            <span style={{ fontSize: 14, color: '#6b7280' }}> • קטגוריה: {category}</span>
          ) : null}
        </h2>

        <div className="cards">
          {catalog
            .filter(
              (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((p) => (
              <div key={p.id} className="card">
                <div className="card-head">
                  {/* תמונה אמיתית? <img className="thumb" src={p.image_url} alt={p.name} /> */}
                  <div className="thumb">תמונה</div>
                  <div>
                    <div className="title">{p.name}</div>
                    <div className="sub">
                      {p.brand} • {p.quantity}
                    </div>
                  </div>
                </div>

                <div className="assign-controls">
                  <input
                    placeholder="מחיר"
                    type="number"
                    step="0.01"
                    value={assignments[p.id]?.price || ''}
                    onChange={(e) =>
                      setAssignments((prev) => ({
                        ...prev,
                        [p.id]: { ...prev[p.id], price: e.target.value },
                      }))
                    }
                    className="price-input"
                  />

                  <select
                    value={assignments[p.id]?.status || ''}
                    onChange={(e) =>
                      setAssignments((prev) => ({
                        ...prev,
                        [p.id]: { ...prev[p.id], status: e.target.value },
                      }))
                    }
                    className="assign-select"
                  >
                    <option value="">בחר זמינות</option>
                    <option value="available">זמין</option>
                    <option value="out_of_stock">לא זמין</option>
                  </select>
                </div>

                <button
                  className="add"
                  onClick={() => handleAssignProduct(p.id)}
                  disabled={assignedIds.has(p.id)}
                >
                  {assignedIds.has(p.id) ? 'כבר שויך' : '➕ שייך לסופר'}
                </button>

              </div>
            ))}
        </div>

        {message && <p className="message">{message}</p>}
      </>
    ) : (
      <div className="manage-panel">
      <div className="manage-header manage-header-with-back">
  <button className="qa-btn manage-back" onClick={() => navigate('/')} title="חזרה לבית">
    <span className="qa-back" aria-hidden>↩</span>
    <span>חזור</span>
  </button>

  <h2 className="manage-title">ניהול המוצרים שלך</h2>
</div>

        <div className="manage-search">
          <input
            type="text"
            placeholder="🔍 חפש מוצר או מותג..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ul className="manage-list">
          {myProducts
            .filter(
              (prod) =>
                prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prod.brand.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((prod) => (
              <li key={prod.product_id} className="manage-item">
                <div className="manage-left">
                  <div className="manage-thumb">תמונה</div>
                  <div>
                    <div className="manage-name">
                      {prod.name} ({prod.brand})
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{prod.quantity}</div>
                  </div>
                </div>

                <div className="manage-controls">
                  <span>💰</span>
                  <input
                    type="number"
                    value={prod.price}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value || '0');
                      setMyProducts((prev) =>
                        prev.map((p) => (p.product_id === prod.product_id ? { ...p, price: val } : p))
                      );
                    }}
                    className="manage-input"
                  />
                  <span>₪</span>

                  <select
                    value={editStates[prod.product_id]?.status ?? prod.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditStates((prev) => ({
                        ...prev,
                        [prod.product_id]: {
                          ...prev[prod.product_id],
                          status: val,
                        },
                      }));
                    }}
                    className="manage-select"
                  >
                    <option value="available">זמין</option>
                    <option value="out_of_stock">לא זמין</option>
                  </select>

                  <div className="manage-actions">
                    <button
                      onClick={() => {
                        const changes = editStates[prod.product_id] || {};
                        const updatedPrice = changes.price ?? prod.price;
                        const updatedStatus = changes.status ?? prod.status;
                        updateProduct(prod.product_id, updatedPrice, updatedStatus);
                      }}
                      className="btn btn-primary"
                    >
                      עדכן
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        setSelectedProductId(
                          selectedProductId === prod.product_id ? null : prod.product_id
                        )
                      }
                    >
                      {selectedProductId === prod.product_id ? 'סגור תגובות' : 'הצג תגובות'}
                    </button>

                    <button className="btn btn-danger" onClick={() => deleteProduct(prod.product_id)}>
                      מחק
                    </button>
                  </div>
                </div>

                {selectedProductId === prod.product_id && (
                  <div style={{ marginTop: 8, width: '100%' }}>
                    <CommentSection
                      product={{
                        id: prod.product_id,
                        name: prod.name,
                        brand: prod.brand,
                        quantity: prod.quantity,
                      }}
                      onClose={() => setSelectedProductId(null)}
                    />
                  </div>
                )}
              </li>
            ))}
        </ul>

        {message && <p className="manage-message">{message}</p>}
      </div>
    )}
  </div>
);
}