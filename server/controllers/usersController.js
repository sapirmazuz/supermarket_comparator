const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModels');
const Supermarket = require('../models/supermarketsModels');

exports.register = async (req, res) => {
  const { name, email, password, role, supermarketName, supermarketAddress } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let supermarket_id = null;

    // אם מדובר במנהל – צור סופרמרקט חדש
    if (role === 'manager') {
      if (!supermarketName || supermarketName.trim() === '') {
        return res.status(400).json({ error: 'שם סופרמרקט נדרש למנהלים' });
      }

      const result = await Supermarket.create({
        name: supermarketName,
        address: supermarketAddress,
        user_id: null
      });

      supermarket_id = result.insertId;
      console.log('📦 supermarket_id שנוצר:', supermarket_id);
    }

    // צור משתמש
     const user_id = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      supermarket_id
    });
    console.log('👤 user_id שנוצר:', user_id);
    // עדכון user_id בטבלת הסופרמרקט
    if (supermarket_id) {
      await Supermarket.updateUserId(supermarket_id, user_id);
      console.log('🟢 עודכנתי את user_id של הסופרמרקט:', supermarket_id, '->', user_id);

    }

    res.status(201).json({ message: 'ההרשמה בוצעה בהצלחה', supermarket_id, user_id });
  } catch (err) {
    console.error('❌ שגיאה בהרשמה:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'האימייל כבר קיים במערכת' });
    }
    res.status(500).json({ error: 'שגיאה פנימית בשרת' });
  }
};


// התחברות
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        supermarket_id: user.supermarket_id || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
