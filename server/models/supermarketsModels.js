// שאילתות ליצירת סופר, קישור למשתמש.

const db = require('../db');

console.log('✅ supermarketsModels.js loaded');

const Supermarket = {
  getAll: async () => {
    const [supermarkets] = await db.query('SELECT * FROM Supermarkets');
    return supermarkets;
  },

  create: async ({ name, address, user_id }) => {
  const [result] = await db.query(
    'INSERT INTO Supermarkets (name, address, user_id) VALUES (?, ?, ?)',
    [name, address, user_id]
  );
  return result; // ✅ אל תעטפי במערך
},

   // 🆕 פונקציה לעדכון user_id של סופרמרקט
updateUserId: async (supermarketId, userId) => {
  console.log('📢 updateUserId התחילה לפעול');
  const [result] = await db.query(
    'UPDATE Supermarkets SET user_id = ? WHERE id = ?',
    [userId, supermarketId]
  );
  console.log('update result:', result);
  return result;
},


getByUserId: async (userId) => {
  const [rows] = await db.query('SELECT * FROM Supermarkets WHERE user_id = ?', [userId]);
  return rows[0];
}


};



module.exports = Supermarket;
