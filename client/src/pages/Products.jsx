// pages/Products.jsx

import React, { useEffect, useState } from 'react';
import { getUser } from '../services/auth';
import api from '../services/api';
import CommentSection from '../components/CommentSection';
import { useLocation } from 'react-router-dom';


export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const user = getUser();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation();
  const view = new URLSearchParams(location.search).get('view') || 'catalog';


  useEffect(() => {
  fetchCatalog();
  if (user?.role === 'client') {
      fetchCartFromServer(); // ⬅️ שולף מהשרת
    }
  }, []);


  const fetchCatalog = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    }
  };

  const fetchCartFromServer = async () => {
    try {
      const res = await api.get('/products/cart');
      setCart(res.data);
    } catch (err) {
      console.error('❌ שגיאה בשליפת עגלה:', err);
    }
  };


  const addToCart = async (product) => {
    if (cart.find(p => p.id === product.id)) return;

    try {
      await api.post('/products/cart/add', { product_id: product.id });
      const newCart = [...cart, product];
      setCart(newCart);
      setTimeout(() => setMessage(''), 3000); // נקה אחרי 3 שניות
    } catch (err) {
      console.error('❌ שגיאה בהוספה לעגלה:', err);
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
        {cart.length === 0 ? (
          <p className="text-gray-500">לא נוספו מוצרים לעגלה.</p>
        ) : (
          <ul className="mt-2 list-disc list-inside">
            {cart.map((p) => (
              <li key={p.id} className="flex justify-between items-center gap-4">
                <span>{p.name} ({p.brand} - {p.quantity})</span>
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
