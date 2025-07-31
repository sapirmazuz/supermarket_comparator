const db = require('../db');

// הוספת מוצר לקטלוג הראשי (admin בלבד)
exports.createCatalogProduct = async (req, res) => {
  const { name, brand, quantity } = req.body;

  if (!name || !brand || !quantity) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Products (name, brand, quantity) VALUES (?, ?, ?)',
      [name, brand, quantity]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// שיוך מוצר קיים לסופר ספציפי עם מחיר וזמינות
exports.addProductToSupermarket = async (req, res) => {
  const { product_id, price, status } = req.body;
  const userId = req.user?.id;
console.log('👤 משתמש:', req.user);

  if (!product_id || !price || !status) {
    return res.status(400).json({ error: 'Missing product assignment fields' });
  }

  try {
    const [users] = await db.query(
      'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({ error: 'רק מנהל יכול לשייך מוצרים' });
    }

    const supermarket_id = users[0].supermarket_id;

    await db.query(
      'INSERT INTO SupermarketProducts (supermarket_id, product_id, price, status) VALUES (?, ?, ?, ?)',
      [supermarket_id, product_id, price, status]
    );

    res.status(201).json({ message: 'Product assigned to supermarket' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to assign product' });
  }
};

// שליפת הקטלוג המלא (לכולם)
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM Products');
    res.json(products);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

// שליפת מוצרים זמינים בסופר מסוים (ללקוח)
exports.getAvailableProductsForSupermarket = async (req, res) => {
  const { supermarket_id } = req.query;

  if (!supermarket_id) {
    return res.status(400).json({ error: 'Missing supermarket_id' });
  }

  try {
    const [rows] = await db.query(
      `SELECT p.id, p.name, p.brand, p.quantity, sp.price, sp.status
       FROM SupermarketProducts sp
       JOIN Products p ON sp.product_id = p.id
       WHERE sp.supermarket_id = ? AND sp.status = 'available'`,
      [supermarket_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

