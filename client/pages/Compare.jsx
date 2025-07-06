import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MapView from '../components/MapView';

export default function Compare() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchComparison = async () => {
      try {
        const res = await api.post('/compare', { cart });
        setResults(res.data);
      } catch (err) {
        console.error('שגיאה בקבלת השוואה:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, []);

  return (
    <div>
      <h2>השוואת סופרים לפי סל הקניות שלך</h2>

      {loading ? (
        <p>טוען תוצאות...</p>
      ) : results.length === 0 ? (
        <p>העגלה ריקה או שלא נמצאו תוצאות.</p>
      ) : (
        <div>
          {results.map((s, i) => (
            <div key={i} style={{ border: '1px solid gray', marginBottom: '10px', padding: '10px' }}>
              <h3>{s.name} – ₪{s.total}</h3>
              <p>{s.address}</p>
              {s.missing.length > 0 ? (
                <p style={{ color: 'red' }}>
                  חסרים פריטים: {s.missing.join(', ')}
                </p>
              ) : (
                <p style={{ color: 'green' }}>כל המוצרים זמינים</p>
              )}
            </div>
          ))}

          <MapView supermarkets={results} />
        </div>
      )}
    </div>
  );
}
