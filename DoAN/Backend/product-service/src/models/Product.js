const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  symptomTags: [{ type: String, trim: true }] // VD: ["đau đầu", "sốt", "đau dạ dày"]
}, { timestamps: true });

// Index để tìm kiếm theo tags nhanh hơn
productSchema.index({ symptomTags: 1 });

module.exports = mongoose.model('Product', productSchema);
