const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const prescriptionVaultSchema = new mongoose.Schema(
  {
    requestCode: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerPhone: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },

    prescriptionCode: { type: String, required: false },
    doctorName: { type: String, required: false },
    hospital: { type: String, required: false },
    diagnosis: { type: String, required: false },
    issueDate: { type: Date, required: false },
    expiryDate: { type: Date, required: false },

    medicines: [medicineSchema],
    totalAmount: { type: Number, default: 0 },
    pharmacistNote: { type: String, required: false },
  },
  { timestamps: true }
);

prescriptionVaultSchema.pre('validate', async function autoGenerateRequestCode(next) {
  if (!this.isNew || this.requestCode) {
    return next();
  }

  try {
    const year = new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const count = await this.constructor.countDocuments({
      createdAt: { $gte: start, $lt: end },
    });

    this.requestCode = `RX-${year}-${String(count + 1).padStart(3, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('PrescriptionVault', prescriptionVaultSchema, 'prescriptionvaults');
