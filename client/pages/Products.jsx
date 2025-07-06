import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div>
      <h2>מוצרים זמינים</h2>
      {products.length === 0 ? (
        <p>אין מוצרים להצגה</p>
      ) : (
        products.map(p => (
          <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
        ))
      )}
    </div>
  );
}
