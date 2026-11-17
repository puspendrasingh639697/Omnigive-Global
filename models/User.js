const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
  lookingFor: { type: String, enum: ['Male', 'Female', 'Everyone', ''] },
  bio: { type: String, default: "" },
  city: { type: String, default: "" },
  profilePic: { type: String, default: "" },

  // ✅ Coins System (Gift & Monetization ke liye)
  goldCoins: { type: Number, default: 500 },   
  diamondCoins: { type: Number, default: 0 },  
  
  // ✅ Gift Stats (Profile par dikhane ke liye)
  totalGiftsReceived: { type: Number, default: 0 }, 
  totalGiftsSent: { type: Number, default: 0 },     
  
  // ✅ Firebase Notification Token
  fcmToken: { type: String, default: "" },

  // ✅ Online Status (Real-time track karne ke liye)
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },

  // ✅ Premium/SaaS subscription
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date, default: null },

  // ✅ Onboarding Preferences (Matching Algorithm ke liye)
  preferences: {
    belief: { type: String, default: "" },       // Spiritual, Agnostic, Atheist
    vibe: { type: String, default: "" },         // Late-night Talks, Coffee & Books
    intent: { type: String, default: "" },       // Deep Midnight Chat, Global Friendship
    ageRange: { type: String, default: "" },     // 18-24, 25-32
    interests: [{ type: String }]                // ["Stargazing", "Jazz", "Coding"]
  },

  // ✅ NAYA: Block & Report (Block/Unblock/Report feature ke liye)
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reportedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);