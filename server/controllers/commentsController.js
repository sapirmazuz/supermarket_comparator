const Comment = require('../models/commentsModels');

exports.getAllComments = async (req, res) => {
  const { supermarket_id } = req.query;

  try {
    const comments = supermarket_id
      ? await Comment.getBySupermarketId(supermarket_id)
      : await Comment.getAll();

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשליפת תגובות' });
  }
};

// הוספת תגובה
exports.addComment = async (req, res) => {
  const { user_id, supermarket_id, content, image_url } = req.body;
  try {
    const commentId = await Comment.create({ user_id, supermarket_id, content, image_url });
    res.status(201).json({ message: 'תגובה נוספה בהצלחה', comment_id: commentId });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בהוספת תגובה' });
  }
};
