const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, default: 'TBD' },
  paymentMethod: { type: String, default: 'cod' },
  customerName: { type: String },
  customerPhone: { type: String },
  customerEmail: { type: String },
  note: { type: String },
  status: { 
    type: String, 
    enum: ['UNPAID', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
    default: 'UNPAID' 
  },
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PrescriptionVault' },
  prescriptionImageUrl: { type: String },
  orderCode: { type: String, unique: true, sparse: true },
  isQuoted: { type: Boolean, default: false }, // true = created by pharmacist after Rx approval
}, { timestamps: true });

// Pre-save hook to auto-generate orderCode
orderSchema.pre('save', async function(next) {
  if (this.orderCode) return next();
  try {
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      today.getDate().toString().padStart(2, '0');
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay   = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const count = await this.constructor.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    this.orderCode = `ORD-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    next();
  } catch (error) { next(error); }
});

module.exports = mongoose.model('Order', orderSchema);
