const Supermarket = require('../models/supermarketsModels');

// שליפת כל הסופרים
exports.getAllSupermarkets = async (req, res) => {
  try {
    const supermarkets = await Supermarket.getAll();
    res.json(supermarkets);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשליפת סופרים' });
  }
};

// הוספת סופר
exports.addSupermarket = async (req, res) => {
  const { name, address } = req.body;
  try {
    const id = await Supermarket.create({ name, address });
    res.status(201).json({ message: 'סופר נוסף בהצלחה', id });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בהוספת סופר' });
  }
};
