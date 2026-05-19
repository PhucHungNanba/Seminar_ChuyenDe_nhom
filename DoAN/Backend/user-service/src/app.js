const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

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

// API Gateway strip /api/users trước khi forward, nên mount tại root '/'
app.use('/', authRoutes);
app.use('/', userRoutes);

// Hỗ trợ thêm prefix /api/users cho môi trường test và gọi trực tiếp
app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', code: 404 });
});

module.exports = app;
