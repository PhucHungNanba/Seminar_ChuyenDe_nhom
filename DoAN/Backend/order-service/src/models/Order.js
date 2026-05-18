const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'shipped'], default: 'pending' },
  prescriptionImageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
