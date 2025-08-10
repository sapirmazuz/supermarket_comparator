// pages/Products.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { getUser } from '../services/auth';
import api from '../services/api';
import CommentSection from '../components/CommentSection';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/products.css';
import cartIcon from '../assets/cart.png';
import { getLocalPackshot } from '../utils/thumbs';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const user = getUser();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation();
  const view = new URLSearchParams(location.search).get('view') || 'catalog';
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});
  const category = new URLSearchParams(location.search).get('category');
const qParam = new URLSearchParams(location.search).get('q') || '';
// מזהה מוצר אחיד: תומך גם ב{id} וגם ב{product_id}
const getPid = (x) => x?.product_id ?? x?.id;

// סט מזהים מהעגלה לבדיקת "האם כבר בעגלה"
const cartIds = useMemo(() => new Set(cart.map(item => getPid(item))), [cart]);


const goToCart = () => {
  if (user?.role === 'manager') navigate('/dashboard?view=manage');
  else navigate('/products?view=cart');
};
const goHome = () => navigate('/');


  const fetchCartFromServer = async () => {
    try {
      const res = await api.get('/products/cart');
      setCart(res.data);
    } catch (err) {
      console.error('❌ שגיאה בשליפת עגלה:', err);
    }
  };


useEffect(() => {
  fetchCatalog();
  if (user?.role === 'client') {
    fetchCartFromServer();
  }
}, [category]); // ← הקטלוג נטען מחדש כשמשתנה הקטגוריה

const fetchCatalog = async () => {
  try {
    let endpoint = '/products';
    if (category) endpoint += `?category=${category}`;
    const res = await api.get(endpoint);
    setProducts(res.data);
  } catch (err) {
    console.error('שגיאה בטעינת מוצרים:', err);
  }
};


  const addToCart = async (product) => {
    if (cartIds.has(getPid(product))) {
      setMessage('⚠️ המוצר כבר בעגלה');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

  const quantity = quantities[product.id] || 1;

  try {
    await api.post('/products/cart/add', {
      product_id: product.id,
      quantity,
    });

    const newCart = [...cart, { ...product, quantity }];
    setCart(newCart);
    setMessage('✔️ המוצר נוסף לעגלה!');
    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    console.error('❌ שגיאה בהוספה לעגלה:', err);
  }
};

const updateCartQuantity = async (productId, newQuantity) => {
  try {
    await api.put('/products/cart/update', {
      product_id: productId,
      quantity: newQuantity,
    });

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  } catch (err) {
    console.error('❌ שגיאה בעדכון כמות:', err);
  }
};

  const removeFromCart = async (id) => {
    try {
      await api.delete('/products/cart/remove', {
        data: { product_id: id }
      });
      const newCart = cart.filter(p => p.id !== id);
      setCart(newCart);
    } catch (err) {
      console.error('❌ שגיאה בהסרה מהעגלה:', err);
    }
  };

  const clearCart = async () => {
  try {
    await api.delete('/products/cart/clear');
    setCart([]);
    setMessage('🧹 העגלה נוקתה!');
    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    console.error('❌ שגיאה בניקוי העגלה:', err);
  }
};

useEffect(() => {
  setSearchQuery(qParam);   // לסנכרן את תיבת החיפוש עם q מה-URL
}, [qParam]);

return (
    <div className="catalog">
      {view === 'catalog' && (
        <>
          <div className="catalog-header">
            <div className="search">
              <input
                type="text"
                placeholder="🔍 חיפוש מוצר, מותג או קטגוריה…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="quick-actions">
              <button className="qa-btn" onClick={goToCart} title="העגלה שלי">
                <img src={cartIcon} alt="עגלה" />
                <span>העגלה שלי</span>
              </button>

              <button className="qa-btn" onClick={goHome} title="חזרה לבית">
                <span className="qa-back" aria-hidden>
                  ↩
                </span>
                <span>חזור</span>
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold" style={{ margin: '8px 0 12px' }}>
            🛒 קטלוג מוצרים
          </h2>

          <div className="cards">
            {products
              .filter(
                (p) =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.brand.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((p) => {
                const src = getLocalPackshot(p); // ← עשוי להיות string או null
                return (
                  <div key={p.id} className="card">
                    <div className="card-head">
                      <div className="thumb">
                        {src ? (
                          <img src={src} alt={p.name} loading="lazy" decoding="async" />
                        ) : (
                          <img src="/placeholder.svg" alt="" loading="lazy" decoding="async" />
                        )}
                      </div>

                      <div>
                        <div className="title">{p.name}</div>
                        <div className="sub">
                          {p.brand} • {p.quantity}
                        </div>
                        {p.price && (
                          <>
                            <div className="price">₪{p.price}</div>
                            <div className="per-unit">
                              ₪{(p.price / (quantities[p.id] || 1)).toFixed(2)} ליח׳
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="qty">
                      <button
                        type="button"
                        className="step"
                        onClick={() => {
                          const current = quantities[p.id] || 1;
                          const next = Math.max(1, current - 1);
                          setQuantities({ ...quantities, [p.id]: next });
                        }}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={quantities[p.id] || 1}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [p.id]: Math.max(1, parseInt(e.target.value || '1', 10)),
                          })
                        }
                      />

                      <button
                        type="button"
                        className="step"
                        onClick={() => {
                          const current = quantities[p.id] || 1;
                          setQuantities({ ...quantities, [p.id]: current + 1 });
                        }}
                      >
                        +
                      </button>
                    </div>
                    {(() => {
                      const inCart = cartIds.has(getPid(p));
                      return (
                        <button
                          className="add"
                          onClick={() => !inCart && addToCart(p)}
                          disabled={inCart}
                          title={inCart ? 'כבר בעגלה' : 'הוסף לעגלה'}
                        >
                          {inCart ? 'כבר בעגלה' : '➕ הוסף לעגלה'}
                        </button>
                      );
                    })()}

                  </div>
                );
              })}
          </div>

          {message && <p className="message">{message}</p>}
        </>
      )}

      {view === 'cart' && (
        <div className="cart-panel" style={{ marginTop: 12 }}>
          {/* הכותרת + כפתור חזור באותה שורה */}
          <div className="cart-header cart-header-with-back">
            <button className="qa-btn cart-back" onClick={goHome} title="חזרה לבית">
              <span className="qa-back" aria-hidden>
                ↩
              </span>
              <span>חזור</span>
            </button>

            <h2 className="cart-title">העגלה שלי</h2>
          </div>

          {cart.length > 0 && (
            <div className="cart-actions">
              <button onClick={() => navigate('/compare')} className="btn btn-primary">
                חשב את הסופר הכי משתלם
              </button>
              <button onClick={clearCart} className="btn btn-danger">
                נקה את העגלה
              </button>
            </div>
          )}

          {cart.length === 0 ? (
            <p className="cart-empty">לא נוספו מוצרים לעגלה.</p>
          ) : (
            <ul className="cart-list">
              {cart.map((p) => {
                const src = getLocalPackshot(p); // ← כמו בקטלוג
                return (
                  <li key={p.id} className="cart-item">
                    <div className="cart-left">
                      <div className="thumb">
  {(() => {
    // מנסים לשחזר את המוצר מהקטלוג כדי לקבל את ה-quantity המקורי (למפתח התמונה)
    const cat = products.find(x => x.id === p.id);
    const src = getLocalPackshot(cat || p);  // הפונקציה כבר מחזירה /placeholder.svg כשאין התאמה
    return (
      <img
        src={src}
        alt={p.name}
        loading="lazy"
        decoding="async"
      />
    );
  })()}
</div>

                      <div>
                        <div className="item-title">
                          {p.name} ({p.brand})
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={p.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value || '1', 10);
                            if (newQty >= 1) updateCartQuantity(p.id, newQty);
                          }}
                          className="qty-input"
                        />
                      </div>
                    </div>

                    <div className="item-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          setSelectedProduct({
                            id: p.id,
                            name: p.name,
                            brand: p.brand,
                            quantity: p.quantity,
                          })
                        }
                      >
                        תגובות
                      </button>
                      <button className="btn btn-danger" onClick={() => removeFromCart(p.id)}>
                        הסר
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {selectedProduct && (
            <CommentSection product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          )}
        </div>
      )}
    </div>
  );
}