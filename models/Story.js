const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaUrl: {
    type: String, // Photo ya Video ka URL (Cloudinary se aayega)
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  // Story 24 ghante baad delete karne ke liye TTL (Time To Live) index
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 ghante (86400 seconds) me automatically delete ho jayegi
  }
});

module.exports = mongoose.model('Story', storySchema);