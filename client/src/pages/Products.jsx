import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../services/auth';
import api from '../services/api';
import CommentSection from '../components/CommentSection';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const user = getUser();
  const [editStates, setEditStates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (user?.role === 'manager') {
      api.get('/products/my')
        .then(res => setMyProducts(res.data))
        .catch(err => console.error('❌ שגיאה בשליפת המוצרים של הסופר:', err));
    }
  }, []);

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
    if (cart.find(p => p.id === product.id)) return;
    setCart([...cart, product]);
  };

  const assignToSupermarket = async (product) => {
    try {
      await api.post('/products/assign', {
        product_id: product.id,
        price: 0,
        status: 'available'
      });
      const res = await api.get('/products/my');
      setMyProducts(res.data);
    } catch (err) {
      console.error('❌ שגיאה בשיוך מוצר לסופר:', err);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(p => p.id !== id));
  };

  const deleteProduct = async (product_id) => {
    try {
      await api.delete(`/products/my/${product_id}`);
      setMyProducts(prev => prev.filter(p => p.product_id !== product_id));
    } catch (err) {
      console.error('שגיאה במחיקת מוצר:', err);
    }
  };

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
    } catch (err) {
      console.error('שגיאה בעדכון מוצר:', err);
    }
  };

  return (
    <div className="p-4">

      {/* לקוח – קטלוג והעגלה */}
      {user?.role === 'customer' && (
        <>
          <h2 className="text-xl font-bold mb-4">🛒 Product Catalog</h2>
          <input
            type="text"
            placeholder="🔍 חפש מוצר או מותג..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-1 rounded w-full mb-4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products
              .filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((p) => (
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
        </>
      )}

      {/* מנהל – הקטלוג הכללי לצורך שיוך לסופר */}
      {user?.role === 'manager' && (
        <>
          <h2 className="text-xl font-bold mb-4">📦 קטלוג כללי לשיוך לסופר</h2>
          <input
            type="text"
            placeholder="🔍 חפש מוצר או מותג..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-1 rounded w-full mb-4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products
              .filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((p) => (
                <div key={p.id} className="border p-3 rounded shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-600">{p.brand} • {p.quantity}</p>
                  </div>
                  <button
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => assignToSupermarket(p)}
                  >
                    🏬 שיוך לסופר
                  </button>
                </div>
              ))}
          </div>
        </>
      )}

      {/* מנהל – מוצרים ששויכו לסופר עם עריכה */}
      {user?.role === 'manager' && (
        <div style={{ marginTop: '30px' }}>
          <h3 className="text-xl font-bold mb-2">🗂️ המוצרים של הסופר שלך:</h3>
          <ul>
            {myProducts
              .filter(prod =>
                prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prod.brand.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((prod, idx) => (
                <li key={idx} style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}>
                  <b>{prod.name}</b> | {prod.brand} | {prod.quantity}
                  <br />
                  💰
                  <input
                    type="number"
                    value={prod.price}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setMyProducts((prev) =>
                        prev.map((p) =>
                          p.product_id === prod.product_id ? { ...p, price: val } : p
                        )
                      );
                    }}
                    style={{ width: '60px', marginInline: '10px' }}
                  />
                  ₪

                  <select
                    value={editStates[prod.product_id]?.status ?? prod.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditStates(prev => ({
                        ...prev,
                        [prod.product_id]: {
                          ...prev[prod.product_id],
                          status: val
                        }
                      }));
                    }}
                    style={{ marginInline: '10px' }}
                  >
                    <option value="available">זמין</option>
                    <option value="out_of_stock">לא זמין</option>
                  </select>

                  <button
                    onClick={() => {
                      const changes = editStates[prod.product_id] || {};
                      const updatedPrice = changes.price ?? prod.price;
                      const updatedStatus = changes.status ?? prod.status;
                      updateProduct(prod.product_id, updatedPrice, updatedStatus);
                    }}
                    style={{ marginInlineStart: '5px' }}
                  >
                    עדכן
                  </button>
                  <button
                    onClick={() => setSelectedProductId(prod.product_id)}
                    style={{ color: 'blue', marginInlineStart: '10px' }}
                  >
                    תגובות
                  </button>
                  <button
                    onClick={() => deleteProduct(prod.product_id)}
                    style={{ color: 'red', marginInlineStart: '10px' }}
                  >
                    מחק
                  </button>
                </li>
              ))}
          </ul>
          {selectedProductId && (
            <CommentSection
              productId={selectedProductId}
              onClose={() => setSelectedProductId(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
