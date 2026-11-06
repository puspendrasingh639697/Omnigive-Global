const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },           // "Gold Package"
  description: { type: String, default: "" },
  price: { type: Number, required: true },           // ₹100
  coins: { type: Number, required: true },           // 1000 gold coins
  type: { 
    type: String, 
    enum: ['Gold', 'Diamond', 'Premium', 'Treasure'], 
    default: 'Gold' 
  },
  imageUrl: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  popular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);