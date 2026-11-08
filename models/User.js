// // const mongoose = require('mongoose');

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true },
// //   age: { type: Number },
// //   gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
// //   lookingFor: { type: String, enum: ['Male', 'Female', 'Everyone', ''] },
// //   bio: { type: String, default: "" },
// //   city: { type: String, default: "" },
// //   profilePic: { type: String, default: "" },
// // }, { timestamps: true });

// // module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   age: { type: Number },
//   gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
//   lookingFor: { type: String, enum: ['Male', 'Female', 'Everyone', ''] },
//   bio: { type: String, default: "" },
//   city: { type: String, default: "" },
//   profilePic: { type: String, default: "" },

//   // ✅ NAYA: Coins System (Gift & Monetization ke liye)
//   goldCoins: { type: Number, default: 500 },   // Signup bonus - Gift bhejne ke liye
//   diamondCoins: { type: Number, default: 0 },  // Purchased coins (SaaS)
  
//   // ✅ NAYA: Gift Stats (Profile par dikhane ke liye)
//   totalGiftsReceived: { type: Number, default: 0 }, // Kitne gift mile
//   totalGiftsSent: { type: Number, default: 0 },     // Kitne gift bheje
  
//   // ✅ NAYA: Firebase Notification Token
//   fcmToken: { type: String, default: "" },

//   // ✅ NAYA: Online Status (Real-time track karne ke liye)
//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: Date.now },

//   // ✅ NAYA: Premium/SaaS subscription
//   isPremium: { type: Boolean, default: false },
//   premiumExpiry: { type: Date, default: null },
  
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


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

  // ✅ NAYA: Coins System (Gift & Monetization ke liye)
  goldCoins: { type: Number, default: 500 },   
  diamondCoins: { type: Number, default: 0 },  
  
  // ✅ NAYA: Gift Stats (Profile par dikhane ke liye)
  totalGiftsReceived: { type: Number, default: 0 }, 
  totalGiftsSent: { type: Number, default: 0 },     
  
  // ✅ NAYA: Firebase Notification Token
  fcmToken: { type: String, default: "" },

  // ✅ NAYA: Online Status (Real-time track karne ke liye)
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },

  // ✅ NAYA: Premium/SaaS subscription
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date, default: null },

  // ✅ NAYA: Onboarding Preferences (Matching Algorithm ke liye)
  preferences: {
    belief: { type: String, default: "" },       // Spiritual, Agnostic, Atheist
    vibe: { type: String, default: "" },         // Late-night Talks, Coffee & Books
    intent: { type: String, default: "" },       // Deep Midnight Chat, Global Friendship
    ageRange: { type: String, default: "" },     // 18-24, 25-32
    interests: [{ type: String }]                // ["Stargazing", "Jazz", "Coding"]
  }
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);