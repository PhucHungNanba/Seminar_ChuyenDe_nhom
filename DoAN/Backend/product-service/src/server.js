require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3002;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Product Service is running on http://localhost:${PORT}`);
  });
});
