const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

// CORS: Cho phép từ Frontend, Admin và API Gateway
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// API Gateway strip /api/products trước khi forward, nên mount tại root '/'
app.use('/', productRoutes);

// Bắt lỗi chung cho toàn bộ app
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error', 
    error: err.message 
  });
});

module.exports = app;
