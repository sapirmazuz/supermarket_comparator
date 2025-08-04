// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import { getUser } from '../services/auth';
// import { useLocation } from 'react-router-dom';

// export default function DashboardManager() {
//   const [catalog, setCatalog] = useState([]);
//   const [assignments, setAssignments] = useState({});
//   const [message, setMessage] = useState('');
//   const user = getUser();
//   const location = useLocation();
//   const [searchQuery, setSearchQuery] = useState('');


//   // טען את הקטלוג הראשי
//   useEffect(() => {
//   api.get('/products')
//     .then(res => setCatalog(res.data))
//     .catch(() => setMessage('שגיאה בטעינת הקטלוג'));
// }, [location.pathname]); // במקום []



//   const handleAssignProduct = async (product_id) => {
//     const { price, status } = assignments[product_id] || {};
//     if (!price || !status) {
//       setMessage('יש להזין מחיר וזמינות');
//       return;
//     }

//     try {
//       await api.post('/products/assign', {
//         product_id,
//         price,
//         status
//       });
//       setMessage('✔️ המוצר שויך לסופר שלך בהצלחה');
//     } catch (error) {
//       setMessage('❌ שגיאה בשיוך המוצר');
//     }

//   };

//   return (
//     <div className="p-4">
//       <h2>🛒 שיוך מוצרים לסופר שלך</h2>
//       <input
//         type="text"
//         placeholder="🔍 חפש מוצר או מותג..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
//       />

//   {catalog
//   .filter(prod =>
//     prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     prod.brand.toLowerCase().includes(searchQuery.toLowerCase())
//   )
//   .map(prod => (
//     <div key={prod.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//       <b>{prod.name}</b> | {prod.brand} | {prod.quantity}
//       <div>
//         <input
//           placeholder="מחיר"
//           type="number"
//           step="0.01"
//           value={assignments[prod.id]?.price || ''}
//           onChange={(e) => setAssignments({
//             ...assignments,
//             [prod.id]: { ...assignments[prod.id], price: e.target.value }
//           })}
//         />
//         <select
//           value={assignments[prod.id]?.status || ''}
//           onChange={(e) => setAssignments({
//             ...assignments,
//             [prod.id]: { ...assignments[prod.id], status: e.target.value }
//           })}
//         >
//           <option value="">בחר זמינות</option>
//           <option value="available">זמין</option>
//           <option value="out_of_stock">לא זמין</option>
//         </select>
//         <button onClick={() => handleAssignProduct(prod.id)}>שייך לסופר</button>
//       </div>
//     </div>
// ))}
//       {message && <p style={{ color: 'green' }}>{message}</p>}
//     </div>
//   );
// }
