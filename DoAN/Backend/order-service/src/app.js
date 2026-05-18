const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/order.routes');

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

// API Gateway strip /api/orders trước khi forward, nên mount tại root '/'
app.use('/', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', code: 404 });
});

module.exports = app;
