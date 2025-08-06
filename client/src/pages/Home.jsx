// client/src/pages/Home.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import cartIcon from '../assets/cart.png'; // ודא שיש אייקון עגלה בתיקייה המתאימה
import { getUser } from '../services/auth';


const categories = [
  { name: 'מוצרי חלב וביצים', image: 'milk.png', category: 'dairy' },
  { name: 'פירות וירקות', image: 'fruits.png', category: 'fruits' },
  { name: 'בשר, עוף ודגים', image: 'meat.png', category: 'meat' },
  { name: 'ממתקים וחטיפים', image: 'snacks.png', category: 'snacks' },
  { name: 'שתייה', image: 'drinks.png', category: 'drinks' },
  { name: 'ניקיון וטואלטיקה', image: 'cleaning.png', category: 'cleaning' },
  { name: 'ירקות קפואים ושימורים', image: 'frozen.png', category: 'frozen' },
  { name: 'מוצרים יבשים', image: 'pantry.png', category: 'pantry' },
  { name: 'לחמים ומאפים', image: 'bread.png', category: 'bread' },
];

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();

const goToCart = () => {
  navigate('/products?view=cart'); // ✅ נדרש לעגלת לקוח
};
  
  const handleCategoryClick = (category) => {
    if (user?.role === 'manager') {
      navigate(`/dashboard-manager?view=assign&category=${encodeURIComponent(category)}`);
    } else {
      navigate(`/products?view=catalog&category=${encodeURIComponent(category)}`);
    }
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
        <div
          className="category"
          key={cat.category}
          onClick={() => handleCategoryClick(cat.category)}

        >
          <img src={require(`../assets/${cat.image}`)} alt={cat.name} />
          <p>{cat.name}</p>
        </div>
      ))}
    </section>
  </div>
);
}