const commentModel = require('../models/commentsModels');

// יצירת תגובה חדשה (רק לקוח)
exports.createComment = async (req, res) => {
  const user_id = req.user?.id;
  const { product_id, text, supermarket_id } = req.body;
  const image_url = req.file?.filename || null;


  console.log('🔍 קלט שהתקבל ביצירת תגובה:', {
    user_id,
    product_id,
    text,
    supermarket_id,
    image_url
  });

  if (!product_id || !text || !supermarket_id) {
    return res.status(400).json({ error: 'חסרים פרטי תגובה או סופרמרקט' });
  }

  try {
    await commentModel.insertComment(user_id, product_id, supermarket_id, text, image_url);
    res.status(201).json({ message: '✅ תגובה נוספה בהצלחה' });
  } catch (err) {
    console.error('❌ שגיאה ביצירת תגובה:', err);
    res.status(500).json({ error: 'שגיאה ביצירת תגובה' });
  }
};

exports.getAllComments = async (req, res) => {
  const user_id = req.user?.id;
  const role = req.user?.role;
  const product_id = req.query.product_id;

  if (!product_id) {
    return res.status(400).json({ error: 'חסר product_id' });
  }

  try {
    if (role === 'manager') {
      const supermarket_id = await commentModel.getManagerSupermarketId(user_id);

      if (!supermarket_id) {
        return res.status(403).json({ error: '⛔ אין סופרמרקט משויך למנהל הזה' });
      }

      const comments = await commentModel.getCommentsBySupermarketAndProduct(supermarket_id, product_id);
      return res.json(comments);
    }

    // לקוח – מחזיר את כל התגובות על המוצר
    const comments = await commentModel.getAllCommentsByProduct(product_id);
    res.json(comments);
  } catch (err) {
    console.error('❌ שגיאה בשליפת תגובות:', err);
    res.status(500).json({ error: 'שגיאה בשליפת תגובות' });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user?.id;

  try {
    const comment = await commentModel.getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'תגובה לא נמצאה' });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({ error: 'אין הרשאה למחוק תגובה זו' });
    }

    await commentModel.deleteCommentById(commentId);
    res.json({ message: '🗑️ תגובה נמחקה בהצלחה' });
  } catch (err) {
    console.error('❌ שגיאה במחיקת תגובה:', err);
    res.status(500).json({ error: 'שגיאה במחיקת תגובה' });
  }
};

