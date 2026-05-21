const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, default: '' },
  price:         { type: Number, required: true, min: 0 },
  quantity:      { type: Number, required: true, min: 0, default: 0 },
  // Optional legacy / extended inventory fields
  stock_quantity:{ type: Number, min: 0 },
  inventory:     { type: Object },
  images:        [{ type: String }],
  symptomTags:   [{ type: String, trim: true }],
  // Thêm các field cần thiết cho Frontend
  type:          { type: String, enum: ['otc', 'rx', 'vitamin', 'personal_care', 'medical_device'], default: 'otc' },
  form:          { type: String, default: 'tablet' },
  manufacturer:  { type: String, default: '' },
  brand:         { type: String, default: '' },
  unit:          { type: String, default: 'hộp' },
  badge:         { type: String, default: '' },
  productCode:   { type: String, required: true, unique: true },
}, { timestamps: true });

// Index để tìm kiếm theo tags nhanh hơn
productSchema.index({ symptomTags: 1 });
productSchema.index({ type: 1 });
productSchema.index({ productCode: 1 });

productSchema.pre('validate', async function(next) {
  if (this.productCode) {
    return next();
  }
  try {
    const count = await this.constructor.countDocuments();
    const code = `MED-${(count + 1).toString().padStart(6, '0')}`;
    this.productCode = code;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Product', productSchema);
