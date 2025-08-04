// pages/Products.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../services/auth';
import api from '../services/api';
import CommentSection from '../components/CommentSection';


export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const user = getUser();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchCatalog();
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    }
  };

  const addToCart = (product) => {
    if (cart.find(p => p.id === product.id)) return;
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setMessage(`✔️ המוצר "${product.name}" נוסף לעגלה`);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(p => p.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <div className="p-4">
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

      <h2 className="text-xl font-bold mt-8">🧺 העגלה שלי</h2>
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

      {message && <p className="mt-4 text-green-700">{message}</p>}
    {selectedProduct && (
      <CommentSection
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
 )}

    </div>
  );
}
