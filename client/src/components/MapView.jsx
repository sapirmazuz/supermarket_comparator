// רכיב המפה שמציג את הסופרים לפי כתובת, עם מחירים כוללים.

import React from 'react';

/**
 * קומפוננטה שמציגה מפה לפי כתובת
 * @param {string} address - כתובת של סופרמרקט להצגה על המפה
 */
const MapView = ({ address }) => {
  if (!address) {
    return <p>לא הוזנה כתובת.</p>;
  }

  // יוצרת URL של iframe לפי הכתובת
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', margin: '1rem 0' }}>
      <iframe
        title="Google Map"
        src={mapSrc}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        loading="lazy"
        style={{ border: 0 }}
      />
    </div>
  );
};

export default MapView;
