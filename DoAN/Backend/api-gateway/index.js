const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup CORS: Cho phép từ Frontend và Admin
const allowedOrigins = [
  'http://localhost:5173', // Frontend mặc định Vite
  'http://localhost:5174', // Admin mặc định Vite
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Bỏ qua origin nếu không có (ví dụ: curl, postman) hoặc nằm trong danh sách được phép
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Xử lý lỗi Proxy chung (chống sập Gateway khi một service bị down)
const onError = (err, req, res, target) => {
  console.error(`[Proxy Error] - ${err.message} (Target: ${target})`);
  res.status(503).json({
    success: false,
    message: 'Service Unavailable',
    error: err.message
  });
};

// Cấu hình Proxy Middleware
const createServiceProxy = (target) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    onError: (err, req, res) => onError(err, req, res, target)
  });
};

// Định tuyến (Routing) tới các Microservices
app.use('/api/users', createServiceProxy('http://localhost:3001'));
app.use('/api/products', createServiceProxy('http://localhost:3002'));
app.use('/api/orders', createServiceProxy('http://localhost:3003'));
app.use('/api/ai', createServiceProxy('http://localhost:8000'));

// Health check cho API Gateway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API Gateway is running smoothly 🟢' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
  console.log(`📡 Routes mapping:`);
  console.log(`  - /api/users    -> http://localhost:3001`);
  console.log(`  - /api/products -> http://localhost:3002`);
  console.log(`  - /api/orders   -> http://localhost:3003`);
  console.log(`  - /api/ai       -> http://localhost:8000`);
});
