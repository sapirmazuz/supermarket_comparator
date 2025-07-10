const db = require('../db');

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
    return result;
  },

   // 🆕 פונקציה לעדכון user_id של סופרמרקט
  updateUserId: async (supermarketId, userId) => {
  await db.query(
    'UPDATE Supermarkets SET user_id = ? WHERE id = ?',
    [userId, supermarketId]
  );
},

getByUserId: async (userId) => {
  const [rows] = await db.query('SELECT * FROM Supermarkets WHERE user_id = ?', [userId]);
  return rows[0];
}


};



module.exports = Supermarket;
