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
  type:          { type: String, enum: ['otc', 'rx'], default: 'otc' },
  manufacturer:  { type: String, default: '' },
  brand:         { type: String, default: '' },
  unit:          { type: String, default: 'hộp' },
  badge:         { type: String, default: '' },
  rating:        { type: Number, default: 4.5, min: 0, max: 5 },
}, { timestamps: true });

// Index để tìm kiếm theo tags nhanh hơn
productSchema.index({ symptomTags: 1 });
productSchema.index({ type: 1 });

module.exports = mongoose.model('Product', productSchema);
