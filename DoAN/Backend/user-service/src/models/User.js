const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role:     { type: String, enum: ['Admin', 'Pharmacist', 'Customer'], default: 'Customer' },
  phone:    { type: String },
  reward_points: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
