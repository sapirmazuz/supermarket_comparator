// קובץ ראשי של האפליקציה. מגדיר Express, middlewares, routes.

const express = require('express');
const cors = require('cors');
const compareRoutes = require('./routes/compare');
const path = require('path');  
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// הגשה סטטית של התמונות: http://localhost:5000/uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/supermarkets', require('./routes/supermarkets'));
app.use('/api/compare', require('./routes/compare'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
