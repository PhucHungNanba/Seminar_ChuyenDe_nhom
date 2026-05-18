const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicine_orders';
    await mongoose.connect(mongoURI);
    console.log('✅ Đã kết nối thành công với MongoDB Atlas! (Order Service)');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
