// // עגלת הקניות של הלקוח עם אפשרות הגדרת העדפות.

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// export default function Cart() {
//   const navigate = useNavigate();
//   const cart = JSON.parse(localStorage.getItem('cart')) || [];

//   const calculateComparison = async () => {
//     try {
//       // שליחת העגלה לשרת (לא ממומש עדיין בשרת, תלוי בך)
//       const res = await api.post('/compare', { cart });
//       localStorage.setItem('compareResults', JSON.stringify(res.data));
//       navigate('/compare');
//     } catch (err) {
//       console.error('שגיאה בהשוואת סלים:', err);
//     }
//   };

//   return (
//     <div>
//       <h2>העגלה שלי</h2>
//       {cart.length === 0 ? (
//         <p>אין מוצרים בעגלה</p>
//       ) : (
//         cart.map((item, i) => (
//           <div key={i}>
//             <strong>{item.name}</strong> - {item.brand} - {item.quantity} יח' - ₪{item.price}
//           </div>
//         ))
//       )}
//       {cart.length > 0 && (
//         <button onClick={calculateComparison}>חשב את הסופר הכי משתלם</button>
//       )}
//     </div>
//   );
// }
