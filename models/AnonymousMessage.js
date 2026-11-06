const mongoose = require('mongoose');

const anonymousMessageSchema = new mongoose.Schema({
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  senderIp: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('AnonymousMessage', anonymousMessageSchema);