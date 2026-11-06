const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
 category: { 
  type: String, 
  enum: ['Basic', 'Premium', 'Luxury', 'Special', 'Fun'], 
  default: 'Basic' 
},
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Gift', giftSchema);