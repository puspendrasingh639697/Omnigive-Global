const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['like', 'superlike'],
    default: 'like'
  },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Same user ko baar-baar like na kar sake
likeSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);