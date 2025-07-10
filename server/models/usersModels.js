const db = require('../db');

const User = {
  create: async ({ name, email, password, role, supermarket_id }) => {
    return await db.query(
      'INSERT INTO Users (name, email, password, role, supermarket_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role, supermarket_id]
    );
    return result.insertId; // ✅ מחזיר את ה-id של המשתמש החדש
  },

  findByEmail: async (email) => {
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    return users[0];
  }
};

module.exports = User;
