import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser } from '../services/auth';
import { useLocation } from 'react-router-dom';
// import CommentSection from './CommentSection';
import CommentSection from '../components/CommentSection';


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
  const view = new URLSearchParams(location.search).get("view") || "assign";

  useEffect(() => {
    if (view === 'assign') {
      api.get('/products')
        .then(res => setCatalog(res.data))
        .catch(() => setMessage('שגיאה בטעינת הקטלוג'));
    } else if (view === 'manage') {
      api.get('/products/my')
        .then(res => setMyProducts(res.data))
        .catch(() => setMessage('שגיאה בטעינת המוצרים שלך'));
    }
  }, [view]);

  const handleAssignProduct = async (product_id) => {
    const { price, status } = assignments[product_id] || {};
    if (!price || !status) {
      setMessage('יש להזין מחיר וזמינות');
      return;
    }
    try {
      await api.post('/products/assign', { product_id, price, status });
      setMessage('✔️ המוצר שויך בהצלחה');
    } catch (error) {
      setMessage('❌ שגיאה בשיוך המוצר');
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {view === 'assign' ? '🛒 שיוך מוצרים לסופר שלך' : '🛠 ניהול המוצרים שלך'}
      </h2>

      <input
        type="text"
        placeholder="🔍 חפש מוצר או מותג..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border px-3 py-1 rounded w-full mb-4"
      />

      {view === 'assign' && catalog
        .filter(prod =>
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(prod => (
          <div key={prod.id} className="border p-3 rounded mb-2">
            <b>{prod.name}</b> | {prod.brand} | {prod.quantity}
            <div className="mt-2">
              <input
                placeholder="מחיר"
                type="number"
                step="0.01"
                value={assignments[prod.id]?.price || ''}
                onChange={(e) =>
                  setAssignments(prev => ({
                    ...prev,
                    [prod.id]: { ...prev[prod.id], price: e.target.value }
                  }))
                }
                className="border px-2 py-1 mr-2"
              />
              <select
                value={assignments[prod.id]?.status || ''}
                onChange={(e) =>
                  setAssignments(prev => ({
                    ...prev,
                    [prod.id]: { ...prev[prod.id], status: e.target.value }
                  }))
                }
                className="border px-2 py-1 mr-2"
              >
                <option value="">בחר זמינות</option>
                <option value="available">זמין</option>
                <option value="out_of_stock">לא זמין</option>
              </select>
              <button
                onClick={() => handleAssignProduct(prod.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                שייך לסופר
              </button>
            </div>
          </div>
        ))}

      {view === 'manage' && myProducts
        .filter(prod =>
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(prod => (
          <div key={prod.product_id} className="border p-3 rounded mb-2">
            <b>{prod.name}</b> | {prod.brand} | {prod.quantity}
            <div className="mt-2">
              💰
              <input
                type="number"
                value={prod.price}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMyProducts(prev =>
                    prev.map(p =>
                      p.product_id === prod.product_id ? { ...p, price: val } : p
                    )
                  );
                }}
                className="w-20 mx-2"
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
                className="mx-2"
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
                className="ml-2 bg-yellow-400 px-2 py-1 rounded"
              >
                עדכן
              </button>
              <button
                onClick={() => setSelectedProductId(
                  selectedProductId === prod.product_id ? null : prod.product_id)}
              >
                {selectedProductId === prod.product_id ? 'סגור תגובות' : 'הצג תגובות'}
                </button>

                {selectedProductId === prod.product_id && (
                  <CommentSection
                    product={{
                      id: prod.product_id,
                      name: prod.name,
                      brand: prod.brand,
                      quantity: prod.quantity
                    }}
                    onClose={() => setSelectedProductId(null)}
                  />
                )}

              <button
                onClick={() => deleteProduct(prod.product_id)}
                className="ml-2 text-red-600 underline"
              >
                מחק
              </button>
            </div>
          </div>
        ))}
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
