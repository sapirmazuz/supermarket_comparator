import React from 'react';

/**
 * קומפוננטה להצגת מוצר יחיד + כפתור להוספה לעגלה
 * props: product (אובייקט מוצר), onAdd (פונקציית הוספה לעגלה)
 */
export default function ProductCard({ product, onAdd }) {
  return (
    <div style={styles.card}>
      <h3>{product.name}</h3>
      <p>מותג: {product.brand}</p>
      <p>כמות: {product.quantity}</p>
      <p>מחיר: ₪{product.price}</p>
      <p>סופר ID: {product.supermarket_id}</p>
      <button style={styles.button} onClick={() => onAdd(product)}>
        הוסף לעגלה
      </button>
    </div>
  );
}

// עיצוב פשוט
const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '15px',
    margin: '10px',
    borderRadius: '8px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
