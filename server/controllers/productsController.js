const db = require('../db');
const Product = require('../models/productsModels');

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
  const role = req.user?.role;

  console.log('👤 req.user:', req.user);
  console.log('📥 בקשה:', { product_id, price, status });

  if (!product_id || !price || !status) {
    return res.status(400).json({ error: 'Missing product assignment fields' });
  }

  if (role !== 'manager') {
    return res.status(403).json({ error: 'Access denied – not a manager' });
  }

  try {
    const [users] = await db.query(
      'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
      [userId]
    );

    console.log('🔍 תוצאת השאילתה ל-Users:', users);

    if (users.length === 0) {
      return res.status(403).json({ error: 'רק מנהל יכול לשייך מוצרים – לא נמצא מנהל מתאים ב-DB' });
    }

    const supermarket_id = users[0].supermarket_id;

    await db.query(
      'INSERT INTO SupermarketProducts (supermarket_id, product_id, price, status) VALUES (?, ?, ?, ?)',
      [supermarket_id, product_id, price, status]
    );

    console.log(`✅ שויך מוצר ${product_id} לסופר ${supermarket_id}`);
    res.status(201).json({ message: 'Product assigned to supermarket' });
  } catch (err) {
    console.error('❌ DB Error:', err);
    res.status(500).json({ error: 'Failed to assign product', details: err.message });
  }
};


// שליפת קטלוג מסונן לפי קטגוריה
exports.getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    let query = 'SELECT * FROM Products';
    let params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('שגיאה בשליפת מוצרים:', err);
    res.status(500).json({ error: 'שגיאה בשליפת מוצרים' });
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

exports.getMyProducts = async (req, res) => {
  const userId = req.user?.id;
  try {
    const [users] = await db.query(
      'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
      [userId]
    );
    if (users.length === 0) return res.status(403).json({ error: 'מנהל לא נמצא' });

    const supermarket_id = users[0].supermarket_id;

    const [products] = await db.query(`
      SELECT 
        p.name, p.brand, p.quantity, sp.price, sp.status, sp.product_id
      FROM SupermarketProducts sp
      JOIN Products p ON sp.product_id = p.id
      WHERE sp.supermarket_id = ?
    `, [supermarket_id]);

    res.json(products);
  } catch (err) {
    console.error('❌ getMyProducts error:', err);
    res.status(500).json({ error: 'שגיאה בקבלת מוצרים' });
  }
};

exports.updateAssignedProduct = async (req, res) => {
  const { price, status } = req.body;
  const { product_id } = req.params;
  const userId = req.user?.id;

  console.log('📥 בקשת עדכון מוצר התקבלה:', {
    product_id,
    price,
    status,
    userId
  });
  try {
    const [users] = await db.query(
      'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
      [userId]
    );
    if (users.length === 0) return res.status(403).json({ error: 'מנהל לא נמצא' });

    const supermarket_id = users[0].supermarket_id;

    await db.query(
      'UPDATE SupermarketProducts SET price = ?, status = ? WHERE supermarket_id = ? AND product_id = ?',
      [price, status, supermarket_id, product_id]
    );

    res.json({ message: 'עודכן בהצלחה' });
  } catch (err) {
    console.error('❌ updateAssignedProduct error:', err);
    res.status(500).json({ error: 'שגיאה בעדכון מוצר' });
  }
};

exports.deleteAssignedProduct = async (req, res) => {
  const { product_id } = req.params;
  const userId = req.user?.id;

  try {
    const [users] = await db.query(
      'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
      [userId]
    );
    if (users.length === 0) return res.status(403).json({ error: 'מנהל לא נמצא' });

    const supermarket_id = users[0].supermarket_id;

    await db.query(
      'DELETE FROM SupermarketProducts WHERE supermarket_id = ? AND product_id = ?',
      [supermarket_id, product_id]
    );

    res.json({ message: 'נמחק בהצלחה' });
  } catch (err) {
    console.error('❌ deleteAssignedProduct error:', err);
    res.status(500).json({ error: 'שגיאה במחיקת מוצר' });
  }
};

// ✅ הוספת מוצר לעגלה
exports.addToCart = async (req, res) => {
  const user_id = req.user?.id;
  const { product_id, quantity } = req.body;

  if (!product_id) return res.status(400).json({ error: 'חסר product_id' });

  try {
    const qty = quantity && quantity > 0 ? quantity : 1;
    await Product.addToCart(user_id, product_id, qty);
    res.json({ message: '✔️ נוסף לעגלה' });
  } catch (err) {
    console.error('❌ addToCart:', err);
    res.status(500).json({ error: 'שגיאה בהוספה לעגלה' });
  }
};


// ✅ שליפת עגלה של הלקוח
exports.getCart = async (req, res) => {
  const user_id = req.user?.id;

  try {
    const cart = await Product.getCart(user_id);
    res.json(cart);
  } catch (err) {
    console.error('❌ getCart:', err);
    res.status(500).json({ error: 'שגיאה בשליפת עגלה' });
  }
};

// ✅ הסרת מוצר מהעגלה
exports.removeFromCart = async (req, res) => {
  const user_id = req.user?.id;
  const { product_id } = req.body;

  if (!product_id) return res.status(400).json({ error: 'חסר product_id' });

  try {
    await Product.removeFromCart(user_id, product_id);
    res.json({ message: '🗑️ הוסר מהעגלה' });
  } catch (err) {
    console.error('❌ removeFromCart:', err);
    res.status(500).json({ error: 'שגיאה בהסרה מהעגלה' });
  }
};

exports.updateQuantity = async (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user.id;

  if (!product_id || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'Missing or invalid data' });
  }

  try {
    await db.query(
      `UPDATE Carts SET quantity = ? WHERE user_id = ? AND product_id = ?`,
      [quantity, userId, product_id]
    );
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    console.error('❌ שגיאה בעדכון כמות:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM Carts WHERE user_id = ?', [userId]);
    res.json({ message: 'העגלה נוקתה בהצלחה' });
  } catch (err) {
    console.error('❌ שגיאה בניקוי העגלה:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

