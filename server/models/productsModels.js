const db = require('../db');

const Product = {
  // שליפת כל המוצרים בקטלוג הכללי
  getAll: async () => {
    const [products] = await db.query('SELECT * FROM Products');
    return products;
  },

  // הוספת מוצר חדש לקטלוג הכללי
  createCatalogProduct: async ({ name, brand, quantity }) => {
    const [result] = await db.query(
      'INSERT INTO Products (name, brand, quantity) VALUES (?, ?, ?)',
      [name, brand, quantity]
    );
    return result.insertId;
  },

  // שיוך מוצר קיים לסופר מסוים עם מחיר וזמינות
  assignToSupermarket: async ({ supermarket_id, product_id, price, status }) => {
    const [result] = await db.query(
      `INSERT INTO SupermarketProducts (supermarket_id, product_id, price, status)
       VALUES (?, ?, ?, ?)`,
      [supermarket_id, product_id, price, status]
    );
    return result.insertId;
  },

  // שליפת מוצרים זמינים בסופר מסוים (ללקוח)
  getAvailableBySupermarket: async (supermarket_id) => {
    const [rows] = await db.query(
      `SELECT p.id, p.name, p.brand, p.quantity, sp.price, sp.status
       FROM SupermarketProducts sp
       JOIN Products p ON sp.product_id = p.id
       WHERE sp.supermarket_id = ? AND sp.status = 'available'`,
      [supermarket_id]
    );
    return rows;
  }
};

module.exports = Product;
