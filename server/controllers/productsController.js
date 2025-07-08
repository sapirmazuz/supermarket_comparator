const db = require('../db');
const Product = require('../models/productsModels');

// הוספת מוצר חדש (למנהלים בלבד)
exports.addProduct = async (req, res) => {
  const { name, brand, quantity, price, status } = req.body;
  const userId = req.user?.id;

  if (!name || !brand || !quantity || !price || !status) {
    return res.status(400).json({ error: 'Missing product fields' });
  }

  try {
    // שליפת ה־supermarket_id של המנהל
    const [users] = await db.query(
      'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({ error: 'רק מנהל יכול להוסיף מוצרים' });
    }

    const supermarket_id = users[0].supermarket_id;

    if (!supermarket_id) {
      return res.status(400).json({ error: 'למנהל זה לא משויך סופרמרקט' });
    }

    // יצירת המוצר
    const productId = await Product.create({
      name,
      brand,
      quantity,
      price,
      supermarket_id,
      status,
    });

    res.status(201).json({ message: 'Product added', product_id: productId });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// שליפת כל המוצרים (לכולם)
exports.getAllProducts = async (req, res) => {
  try {
    const { supermarket_id } = req.query;

    const products = supermarket_id
      ? await Product.getBySupermarketId(supermarket_id)
      : await Product.getAll();

    res.json(products);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};