const db = require('../db');

const Comment = {
  getAll: async () => {
    const [comments] = await db.query(`
      SELECT Comments.*, Users.name AS user_name
      FROM Comments
      JOIN Users ON Comments.user_id = Users.id
    `);
    return comments;
  },

  create: async ({ user_id, supermarket_id, content, image_url }) => {
    const [result] = await db.query(
      'INSERT INTO Comments (user_id, supermarket_id, content, image_url, created_at) VALUES (?, ?, ?, ?, NOW())',
      [user_id, supermarket_id, content, image_url]
    );
    return result.insertId;
  }
};

module.exports = Comment;
