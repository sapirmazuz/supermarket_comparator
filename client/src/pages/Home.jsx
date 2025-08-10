// client/src/pages/Home.jsx
import React, { useState } from 'react';
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

  const [term, setTerm] = useState('');
  
const goToCart = () => {
  if (user?.role === 'manager') {
    navigate('/dashboard?view=manage'); // ✅ ניהול מוצרים של המנהל
  } else {
    navigate('/products?view=cart'); // ✅ עגלת לקוח
  }
};

  
  const handleCategoryClick = (category) => {
    if (user?.role === 'manager') {
      navigate(`/dashboard?view=assign&category=${encodeURIComponent(category)}`);
    } else {
      navigate(`/products?view=catalog&category=${encodeURIComponent(category)}`);
    }
  };

   const doSearch = () => {
    const q = term.trim();
    if (!q) return;
    // חיפוש מכל המאגר – בלי קטגוריה
    navigate(`/products?view=catalog&q=${encodeURIComponent(q)}`);
  };


 return (
    <div className="homepage">
      <header className="header">
  {/* קבוצה: אייקון עגלה + כותרת צמודים */}
  <div className="brand">
    <div className="cart-icon" onClick={goToCart}>
      <img src={cartIcon} alt="עגלה" />
      <span className="cart-label">העגלה שלי</span>
    </div>
    <h1 className="logo">השוואת מחירי סופרים</h1>
  </div>

  {/* שדה חיפוש ממורכז באמצע */}
  <div className="search-wrap">
    <input
      className="search-bar"
      placeholder="חיפוש מוצר..."
      value={term}
      onChange={(e) => setTerm(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && doSearch()}
    />
  </div>

  {/* ספייסר לסידור מושלם של האמצע */}
  <div className="header-spacer" />
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