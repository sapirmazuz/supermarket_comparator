import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await axios.get('/api/products'); // קטלוג כללי
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    }
  };

  const addToCart = (product) => {
    if (cart.find(p => p.id === product.id)) return; // מניעת כפילויות
    setCart([...cart, product]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(p => p.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🛒 Product Catalog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-3 rounded shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.brand} • {p.quantity}</p>
            </div>
            <button
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">🧺 My Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">No products selected yet.</p>
      ) : (
        <ul className="mt-2 list-disc list-inside">
          {cart.map((p) => (
            <li key={p.id} className="flex justify-between items-center">
              <span>{p.name} ({p.brand} - {p.quantity})</span>
              <button
                className="text-red-600 hover:underline"
                onClick={() => removeFromCart(p.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
