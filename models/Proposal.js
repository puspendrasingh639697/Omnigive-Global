const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
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
  ringType: { 
    type: String, 
    default: "Gold Ring" // Gold, Diamond, etc.
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  loveProgress: { 
    type: Number, 
    default: 10 // 10% se shuru hoga
  }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);