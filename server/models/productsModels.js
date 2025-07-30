// שאילתות למוצרים לפי סופרמרקט, עדכון, מחיקה.

const db = require('../db');

const Product = {
  create: async ({ name, brand, quantity, price, supermarket_id, status }) => {
    const [result] = await db.query(
      'INSERT INTO Products (name, brand, quantity, price, supermarket_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, brand, quantity, price, supermarket_id, status]
    );
    return result.insertId;
  },

  getAll: async () => {
    const [products] = await db.query('SELECT * FROM Products');
    return products;
  },

   // ✅ פונקציה חדשה: שליפת מוצרים לפי סופרמרקט
  getBySupermarketId: async (supermarketId) => {
    const [products] = await db.query(
      'SELECT * FROM Products WHERE supermarket_id = ?',
      [supermarketId]
    );
    return products;
  }
};

module.exports = Product;
