// pages/Products.jsx

import React, { useEffect, useState } from 'react';
import { getUser } from '../services/auth';
import api from '../services/api';
import CommentSection from '../components/CommentSection';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

  // const fetchCatalog = async () => {
  //   try {
  //     const res = await api.get('/products');
  //     setProducts(res.data);
  //   } catch (err) {
  //     console.error('Failed to load catalog:', err);
  //   }
  // };

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
  if (cart.find(p => p.id === product.id)) return;

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



  return (
  <div className="p-4">
    {view === 'catalog' && (
      <>
        <input
          type="text"
          placeholder="🔍 חפש מוצר או מותג..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-1 rounded w-full mb-4"
        />

        <h2 className="text-xl font-bold mb-4">🛒 קטלוג מוצרים</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products
            .filter(p =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((p) => (
              <div key={p.id} className="border p-3 rounded shadow-sm">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.brand} • {p.quantity}</p>
                 <input
                    type="number"
                    min="1"
                    value={quantities[p.id] || 1}
                    onChange={(e) =>
                      setQuantities({ ...quantities, [p.id]: parseInt(e.target.value) })
                    }
                    className="w-full border mt-2 px-2 py-1 rounded"
                    placeholder="כמות"
                  />
                <button
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => addToCart(p)}
                >
                  הוסף לעגלה
                </button>
              </div>
            ))}
        </div>
        {message && <p className="mt-4 text-green-700">{message}</p>}
      </>
    )}

    {view === 'cart' && (
      <>
        <h2 className="text-xl font-bold">🧺 העגלה שלי</h2>
        {cart.length > 0 && (
          <>
            <button onClick={() => navigate('/compare')} className="btn btn-primary">
              חשב את הסופר הכי משתלם
            </button>
            <button
              onClick={clearCart}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              נקה את העגלה
            </button>
          </>
        )}

        {cart.length === 0 ? (
          <p className="text-gray-500">לא נוספו מוצרים לעגלה.</p>
        ) : (
          <ul className="mt-2 list-disc list-inside">
            {cart.map((p) => (
              <li key={p.id} className="flex justify-between items-center gap-4">
                <div className="flex flex-col">
                  <span>{p.name} ({p.brand})</span>
                  <input
                    type="number"
                    min="1"
                    value={p.quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value);
                      if (newQty >= 1) {
                        updateCartQuantity(p.id, newQty);
                      }
                    }}
                    className="w-20 border px-1 py-0.5 rounded mt-1 text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedProduct({
                      id: p.id,
                      name: p.name,
                      brand: p.brand,
                      quantity: p.quantity
                    })}
                  >
                    תגובות
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => removeFromCart(p.id)}
                  >
                    הסר
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {selectedProduct && (
          <CommentSection
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </>
    )}
  </div>
);
}
