// client/src/pages/Compare.jsx

import React, { useEffect, useState } from 'react';
import { getUser } from '../services/auth';
import api from '../services/api';
import MapView from '../components/MapView';
import '../css/compare.css';

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
  <div className="compare">
    <h2 className="compare-title">השוואת סופרים לעגלת הקניות שלך</h2>

    {(!results || results.length === 0) ? (
      <div className="supermarket-card" style={{ textAlign: 'center' }}>
        לא נמצאו תוצאות השוואה
      </div>
    ) : (
      <div className="compare-grid">
        {results.map((supermarket) => (
          <div key={supermarket.supermarket_id} className="supermarket-card">
            {/* כותרת הכרטיס */}
            <div className="card-head">
              <div className="head-left">
                <div className="store-avatar">🏬</div>
                <div>
                  <div className="store-name">{supermarket.name}</div>
                  <div className="store-address">כתובת: {supermarket.address}</div>
                </div>
              </div>

              <div className="total-line">
                <div className="total-price">
                  ₪{!isNaN(supermarket.totalPrice) ? Number(supermarket.totalPrice).toFixed(2) : 'לא זמין'}
                </div>
                {Array.isArray(supermarket.missingProducts) && supermarket.missingProducts.length > 0 && (
                  <div className="missing-badge">{supermarket.missingProducts.length} חסרים</div>
                )}
                {Array.isArray(supermarket.outOfStock) && supermarket.outOfStock.length > 0 && (
                  <div className="oos-badge">{supermarket.outOfStock.length} אזלו</div>
                )}
              </div>
            </div>

            {/* רשימות חסרים/אזלו (אם יש) */}
            {Array.isArray(supermarket.missingProducts) && supermarket.missingProducts.length > 0 && (
              <>
                <div className="section-title missing">מוצרים שלא קיימים בסופר:</div>
                <ul className="list missing">
                  {supermarket.missingProducts.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </>
            )}

            {Array.isArray(supermarket.outOfStock) && supermarket.outOfStock.length > 0 && (
              <>
                <div className="section-title oos">מוצרים שאזלו מהמלאי:</div>
                <ul className="list oos">
                  {supermarket.outOfStock.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </>
            )}

            {/* פעולות */}
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleMapClick(supermarket.address)}
              >
                📍 ניווט
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* מודאל מפה */}
    {showMap && selectedAddress && (
      <div className="map-backdrop">
        <div className="map-modal">
          <h3 className="map-title">מיקום על המפה</h3>
          <MapView address={selectedAddress} />
          <div style={{ marginTop: 12 }}>
            <button onClick={handleCloseMap} className="btn btn-danger">סגור</button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}