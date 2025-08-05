// client/src/pages/Compare.jsx

import React, { useEffect, useState } from 'react';
import { getUser } from '../services/auth';
import api from '../services/api';
import MapView from '../components/MapView';

export default function Compare() {
  const [results, setResults] = useState([]);
  const user = getUser();
  const [selectedAddress, setSelectedAddress] = useState(null); // ✅ הכתובת להצגה
  const [showMap, setShowMap] = useState(false); // ✅ האם להציג את המפה


  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const res = await api.post('/compare', { user_id: user.id });
      setResults(res.data);
    } catch (err) {
      console.error('❌ שגיאה בהשוואת סופרים:', err);
    }
  };

  if (!results.length) return <p>לא נמצאו תוצאות השוואה</p>;

 const handleMapClick = (address) => {
    setSelectedAddress(address);
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
    setSelectedAddress(null);
  };


return (
  <div className="comparison-page">
    <h2>השוואת סופרים לעגלת הקניות שלך</h2>

    {results.map((supermarket) => (
      <div key={supermarket.supermarket_id} className="supermarket-card" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
        <h3>{supermarket.name}</h3>
        <p><strong>כתובת:</strong> {supermarket.address}</p>
        <button
          className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          onClick={() => handleMapClick(supermarket.address)}
        >
          📍 ניווט
        </button>
        <p><strong>מחיר כולל:</strong> ₪{!isNaN(supermarket.totalPrice) ? Number(supermarket.totalPrice).toFixed(2) : 'לא זמין'}</p>

        {supermarket.missingProducts.length > 0 && (
          <>
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              ❌ מוצרים שלא קיימים בסופר:
            </p>
            <ul style={{ color: 'red' }}>
              {supermarket.missingProducts.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </>
        )}

        {supermarket.outOfStock.length > 0 && (
          <>
            <p style={{ color: 'orange', fontWeight: 'bold' }}>
              ⚠️ מוצרים שאזלו מהמלאי:
            </p>
            <ul style={{ color: 'orange' }}>
              {supermarket.outOfStock.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    ))}
    {/* ✅ Modal map */}
      {showMap && selectedAddress && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%',
          height: '100%', backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '1rem', borderRadius: '10px',
            width: '90%', maxWidth: '700px', maxHeight: '90%', overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>מיקום על המפה</h3>
            <MapView address={selectedAddress} />
            <button onClick={handleCloseMap} className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              סגור
            </button>
          </div>
        </div>
      )}
  </div>
);
}