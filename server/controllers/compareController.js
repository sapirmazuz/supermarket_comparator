// server/controllers/compareController.js

const db = require('../db');

exports.compareSupermarkets = async (req, res) => {
  try {
    const userId = req.user.id;

    // שליפת כל המוצרים בעגלה + השמות שלהם
    const [cartItems] = await db.query(`
      SELECT P.id, P.name, C.quantity
      FROM Carts C
      JOIN Products P ON C.product_id = P.id
      WHERE C.user_id = ?
    `, [userId]);

    if (!cartItems.length) {
      return res.json([]);
    }

    // מיפוי בין product_id לבין שם
    const cartMap = {}; // { id: { name, quantity } }
    const productIds = [];

    for (const item of cartItems) {
      cartMap[item.id] = { name: item.name, quantity: item.quantity };
      productIds.push(item.id);
    }


    // שליפת כל הסופרים
    const [supermarkets] = await db.query(`SELECT id, name, address FROM Supermarkets`);

    let results = [];

    for (const market of supermarkets) {
      let foundProducts = [];
      const placeholders = productIds.map(() => '?').join(',');
      const [products] = await db.query(`
        SELECT * FROM SupermarketProducts
        WHERE supermarket_id = ? AND product_id IN (${placeholders})
      `, [market.id, ...productIds]);

      let total = 0;
      let outOfStock = [];
      let missingProducts = [];

      for (const pid of productIds) {
        const found = products.find(p => p.product_id === pid);
        const { name, quantity } = cartMap[pid];

        if (!found) {
          // המוצר בכלל לא קיים בסופר הזה
          missingProducts.push(name);
        } else if (found.status === 'available') {
          // המוצר קיים וזמין
         const pricePerItem = Number(found.price);
          const subtotal = pricePerItem * quantity;
          total += subtotal;
          foundProducts.push({ name, price: pricePerItem, quantity });
        } else {
          // המוצר קיים אך לא זמין
          outOfStock.push(name);
        }
      }

      results.push({
        supermarket_id: market.id,
        name: market.name,
        address: market.address,
        totalPrice: total,
        outOfStock,
        missingProducts,
        foundProducts,
      });
    }

    results.sort((a, b) => a.totalPrice - b.totalPrice);
    res.json(results);

  } catch (err) {
    console.error('❌ שגיאה בהשוואת סופרים:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
