const db = require('../db');

// יצירת תגובה חדשה
exports.insertComment = async (user_id, product_id, supermarket_id, text, image_url) => {
  await db.query(
    `INSERT INTO Comments (user_id, product_id, supermarket_id, text, image_url, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [user_id, product_id, supermarket_id, text, image_url || null]
  );
};

// שליפת תגובה בודדת לפי ID
exports.getCommentById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Comments WHERE id = ?', [id]);
  return rows[0];
};

// מחיקת תגובה לפי ID
exports.deleteCommentById = async (id) => {
  await db.query('DELETE FROM Comments WHERE id = ?', [id]);
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

// ❗ חדש: שליפת תגובות לפי product_id – ללקוחות
exports.getAllCommentsByProduct = async (product_id) => {
  const [comments] = await db.query(
    `SELECT Comments.*, Users.username
     FROM Comments
     JOIN Users ON Comments.user_id = Users.id
     WHERE Comments.product_id = ?
     ORDER BY Comments.created_at DESC`,
    [product_id]
  );
  return comments;
};

// ❗ חדש: שליפת תגובות לפי supermarket_id ו־product_id – למנהלים
exports.getCommentsBySupermarketAndProduct = async (supermarket_id, product_id) => {
  const [comments] = await db.query(
    `SELECT Comments.*, Users.username
     FROM Comments
     JOIN Users ON Comments.user_id = Users.id
     WHERE Comments.supermarket_id = ? AND Comments.product_id = ?
     ORDER BY Comments.created_at DESC`,
    [supermarket_id, product_id]
  );
  return comments;
};
