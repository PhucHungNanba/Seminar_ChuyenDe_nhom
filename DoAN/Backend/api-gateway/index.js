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
const createServiceProxy = (target, extra = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: 'debug',
    proxyTimeout: 15000,  // ⚡ Tăng từ 5000 lên 15000ms (15s)
    timeout: 20000,        // ⚡ Tăng từ 10000 lên 20000ms (20s)
    onError: (err, req, res) => onError(err, req, res, target),
    ...extra,
  });
};

// Định tuyến (Routing) tới các Microservices
// Trong Docker network, phải dùng tên container thay vì localhost
app.use('/api/users', createServiceProxy(process.env.USER_SERVICE_URL || 'http://user-service:3001', {
  pathRewrite: { '^/api/users': '' }
}));
app.use('/api/products', createServiceProxy(process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002', {
  pathRewrite: { '^/api/products': '' }
}));
app.use('/api/orders', createServiceProxy(process.env.ORDER_SERVICE_URL || 'http://order-service:3003', {
  pathRewrite: { '^/api/orders': '' }
}));
// Association rules và AI đều trỏ về ai-service
// Forward association-rules -> ai-service /api/ai
app.use('/api/association-rules', createServiceProxy(process.env.AI_SERVICE_URL || 'http://ai-service:8000', {
  // Express mount strips the base path, so re-add /api/ai for the upstream
  pathRewrite: { '^/': '/api/ai/' }
}));

// Direct AI endpoints
app.use('/api/ai', createServiceProxy(process.env.AI_SERVICE_URL || 'http://ai-service:8000', {
  // Express mount strips /api/ai, add it back for the upstream
  pathRewrite: { '^/': '/api/ai/' }
}));

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
