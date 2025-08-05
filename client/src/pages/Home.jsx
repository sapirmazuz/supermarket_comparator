// client/src/pages/Home.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import cartIcon from '../assets/cart.png'; // ודא שיש אייקון עגלה בתיקייה המתאימה

const categories = [
  { name: 'מוצרי חלב וביצים', image: 'milk.png', category: 'dairy' },
  { name: 'פירות וירקות', image: 'fruits.png', category: 'fruits' },
  { name: 'בשר, עוף ודגים', image: 'meat.png', category: 'meat' },
  { name: 'ממתקים וחטיפים', image: 'snacks.png', category: 'snacks' },
  { name: 'שתייה', image: 'drinks.png', category: 'drinks' },
  { name: 'ניקיון וטואלטיקה', image: 'cleaning.png', category: 'cleaning' },
];

export default function Home() {
  const navigate = useNavigate();

  const goToCategory = (cat) => {
    navigate(`/products?category=${cat}`);
  };

  const goToCart = () => {
    navigate('/products?view=cart');
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="cart-icon" onClick={goToCart}>
          <img src={cartIcon} alt="עגלה" />
        </div>
        <h1 className="logo">השוואת מחירי סופרים</h1>
        <input className="search-bar" placeholder="חיפוש מוצר..." />
      </header>

      <section className="categories">
        {categories.map(cat => (
          <div className="category" key={cat.category} onClick={() => goToCategory(cat.category)}>
            <img src={require(`../assets/${cat.image}`)} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </section>
    </div>
  );
}