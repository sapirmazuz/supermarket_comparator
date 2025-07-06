const db = require('../db');

exports.compareSupermarkets = async (req, res) => {
  const cart = req.body.cart;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'סל קניות לא תקין' });
  }

  try {
    // שליפת כל הסופרים
    const [supermarkets] = await db.query('SELECT * FROM Supermarkets');
    const results = [];

    for (const supermarket of supermarkets) {
      const [products] = await db.query(
        'SELECT * FROM Products WHERE supermarket_id = ?',
        [supermarket.id]
      );

      let total = 0;
      let missing = [];
      for (const item of cart) {
        const match = products.find(p =>
          p.name === item.name &&
          (item.brand ? p.brand === item.brand : true)
        );
        if (match) {
          total += match.price * (item.quantity || 1);
        } else {
          missing.push(item.name + (item.brand ? ` (${item.brand})` : ''));
        }
      }

      results.push({
        supermarket_id: supermarket.id,
        name: supermarket.name,
        address: supermarket.address,
        total: Number(total.toFixed(2)),
        missing
      });
    }

    // מיון לפי מחיר כולל
    results.sort((a, b) => a.total - b.total);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בעת השוואת סופרים' });
  }
};
