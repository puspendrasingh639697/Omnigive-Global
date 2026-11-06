const mongoose = require('mongoose');

const giftTransactionSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  giftId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gift', 
    required: true 
  },
  coinsSpent: { type: Number, required: true },
  message: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('GiftTransaction', giftTransactionSchema);