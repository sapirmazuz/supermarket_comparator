// שאילתות ליצירת משתמש, בדיקת התחברות, שליפת הרשאות.

const db = require('../db');

const User = {
  create: async ({ name, email, password, role, supermarket_id }) => {
   const [result] = await db.query(
      'INSERT INTO Users (name, email, password, role, supermarket_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role, supermarket_id]);
  return result.insertId;
// ✅ מחזיר את ה-id של המשתמש החדש
  },

  findByEmail: async (email) => {
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    return users[0];
  },

  updateSupermarketId: async (userId, supermarketId) => {
    await db.query(
      'UPDATE Users SET supermarket_id = ? WHERE id = ?',
      [supermarketId, userId]
    );
  },



};

module.exports = User;
