const db = require('../db');

// יצירת תגובה חדשה
exports.insertComment = async (user_id, product_id, supermarket_id, text, image_url) => {
  await db.query(
    `INSERT INTO Comments (user_id, product_id, supermarket_id, text, image_url, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [user_id, product_id, supermarket_id, text, image_url || null]
  );
};

// שליפת כל התגובות (ללקוחות)
exports.getAllComments = async () => {
  const [comments] = await db.query(
    `SELECT Comments.*, Products.name AS product_name, Users.username
     FROM Comments
     JOIN Products ON Comments.product_id = Products.id
     JOIN Users ON Comments.user_id = Users.id
     ORDER BY Comments.created_at DESC`
  );
  return comments;
};

// שליפת supermarket_id של מנהל לפי user_id
exports.getManagerSupermarketId = async (user_id) => {
  const [[result]] = await db.query(
    'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
    [user_id]
  );
  return result?.supermarket_id || null;
};

// שליפת supermarket_id של לקוח לפי user_id
exports.getCustomerSupermarketId = async (user_id) => {
  const [[result]] = await db.query(
    'SELECT supermarket_id FROM Users WHERE id = ?',
    [user_id]
  );
  return result?.supermarket_id || null;
};

// שליפת תגובות לפי סופרמרקט (למנהל)
exports.getCommentsBySupermarket = async (supermarket_id) => {
  const [comments] = await db.query(
    `SELECT Comments.*, Products.name AS product_name, Users.username
     FROM Comments
     JOIN Products ON Comments.product_id = Products.id
     JOIN Users ON Comments.user_id = Users.id
     WHERE Comments.supermarket_id = ?
     ORDER BY Comments.created_at DESC`,
    [supermarket_id]
  );
  return comments;
};
