const db = require('../db');

exports.insertComment = async (user_id, product_id, supermarket_id, text, image_url) => {
  await db.query(
    `INSERT INTO Comments (user_id, product_id, supermarket_id, text, image_url, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [user_id, product_id, supermarket_id, text, image_url || null]
  );
};

exports.getCommentById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Comments WHERE id = ?', [id]);
  return rows[0];
};

exports.deleteCommentById = async (id) => {
  await db.query('DELETE FROM Comments WHERE id = ?', [id]);
};

exports.getManagerSupermarketId = async (user_id) => {
  const [[result]] = await db.query(
    'SELECT supermarket_id FROM Users WHERE id = ? AND role = "manager"',
    [user_id]
  );
  return result?.supermarket_id || null;
};

exports.getCustomerSupermarketId = async (user_id) => {
  const [[result]] = await db.query(
    'SELECT supermarket_id FROM Users WHERE id = ?',
    [user_id]
  );
  return result?.supermarket_id || null;
};

exports.getAllCommentsByProduct = async (product_id) => {
  const [comments] = await db.query(
    `SELECT Comments.*, Users.name
     FROM Comments
     JOIN Users ON Comments.user_id = Users.id
     WHERE Comments.product_id = ?
     ORDER BY Comments.created_at DESC`,
    [product_id]
  );
  return comments;
};

exports.getCommentsBySupermarketAndProduct = async (supermarket_id, product_id) => {
  const [comments] = await db.query(
    `SELECT Comments.*, Users.name
     FROM Comments
     JOIN Users ON Comments.user_id = Users.id
     WHERE Comments.supermarket_id = ? AND Comments.product_id = ?
     ORDER BY Comments.created_at DESC`,
    [supermarket_id, product_id]
  );
  return comments;
};