const db = require('../db');

const Supermarket = {
  getAll: async () => {
    const [supermarkets] = await db.query('SELECT * FROM Supermarkets');
    return supermarkets;
  },

  create: async ({ name, address }) => {
    const [result] = await db.query(
      'INSERT INTO Supermarkets (name, address) VALUES (?, ?)',
      [name, address]
    );
    return result.insertId;
  }
};

module.exports = Supermarket;
