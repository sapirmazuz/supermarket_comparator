const commentModel = require('../models/commentsModels');

// יצירת תגובה חדשה (רק לקוח)
exports.createComment = async (req, res) => {
  const user_id = req.user?.id;
  const { product_id, text, image_url } = req.body;

  if (!product_id || !text) {
    return res.status(400).json({ error: 'חסרים פרטי תגובה' });
  }

  try {
    const supermarket_id = await commentModel.getCustomerSupermarketId(user_id);

    if (!supermarket_id) {
      return res.status(400).json({ error: 'לא ניתן לאתר את הסופר שבו נקנה המוצר' });
    }

    await commentModel.insertComment(user_id, product_id, supermarket_id, text, image_url);
    res.status(201).json({ message: '✅ תגובה נוספה בהצלחה' });
  } catch (err) {
    console.error('❌ שגיאה ביצירת תגובה:', err);
    res.status(500).json({ error: 'שגיאה ביצירת תגובה' });
  }
};

// שליפת כל התגובות – ללקוח
exports.getAllComments = async (req, res) => {
  try {
    const comments = await commentModel.getAllComments();
    res.json(comments);
  } catch (err) {
    console.error('❌ שגיאה בשליפת תגובות:', err);
    res.status(500).json({ error: 'שגיאה בשליפת תגובות' });
  }
};

// שליפת תגובות לסופר של מנהל
exports.getManagerComments = async (req, res) => {
  const user_id = req.user?.id;

  try {
    const supermarket_id = await commentModel.getManagerSupermarketId(user_id);

    if (!supermarket_id) {
      return res.status(403).json({ error: '⛔ אין סופרמרקט משויך למנהל הזה' });
    }

    const comments = await commentModel.getCommentsBySupermarket(supermarket_id);
    res.json(comments);
  } catch (err) {
    console.error('❌ שגיאה בשליפת תגובות למנהל:', err);
    res.status(500).json({ error: 'שגיאה בשליפת תגובות' });
  }
};
