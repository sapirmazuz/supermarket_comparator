const Product = require('../models/productsModels');

// הוספת מוצר חדש (למנהלים בלבד)
exports.addProduct = async (req, res) => {
  const { name, brand, quantity, price, supermarket_id, status } = req.body;

  if (!name || !brand || !quantity || !price || !supermarket_id || !status) {
    return res.status(400).json({ error: 'Missing product fields' });
  }

  try {
    const productId = await Product.create({ name, brand, quantity, price, supermarket_id, status });
    res.status(201).json({ message: 'Product added', product_id: productId });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// שליפת כל המוצרים (לכולם)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};
