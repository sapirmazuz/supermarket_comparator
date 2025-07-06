const db = require('../db');

const User = {
  create: async ({ name, email, password, role }) => {
    return await db.query(
      'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
  },

  findByEmail: async (email) => {
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    return users[0];
  }
};

module.exports = User;
