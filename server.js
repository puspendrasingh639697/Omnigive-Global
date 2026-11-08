


// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');
// require('dotenv').config();

// // Configs
// const connectDB = require('./config/db');
// // const admin = require('./config/firebase'); // Firebase commented (deployment ke liye)

// // Models & Routes
// const anonymousRoutes = require('./routes/anonymousRoutes');
// const likeRoutes = require('./routes/likeRoutes');
// const aiRoutes = require('./routes/aiRoutes');
// const giftRoutes = require('./routes/giftRoutes');
// const planRoutes = require('./routes/planRoutes');
// const Message = require('./models/Message'); 
// const User = require('./models/User');
// const authRoutes = require('./routes/authRoutes');
// const lookingRoutes = require('./routes/lookingRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const proposalRoutes = require('./routes/proposalRoutes');

// const app = express();
// const server = http.createServer(app); 

// // ✅ CORS Configuration (Sirf aapki website ko allow karein)
// const allowedOrigins = [
//  "http://localhost:5173",
//   "http://localhost:3000",
//   "https://ovmvigive-web.vercel.app"   // Aapki live website
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       return callback(null, true);
//     } else {
//       return callback(new Error("CORS policy: This origin is not allowed"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // Socket.IO Setup (CORS ke saath)
// const io = new Server(server, {
//   cors: { 
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// // Socket.IO ko app mein set karein (gift notification ke liye zaroori)
// app.set('io', io);

// // Middlewares
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Database Connect
// connectDB();

// // ✅ Routes - Sabse pehle register karein
// app.use('/api/auth', authRoutes);
// app.use('/api/looking', lookingRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/gift', giftRoutes); 
// app.use('/api/plan', planRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/like', likeRoutes);
// app.use('/api/anonymous', anonymousRoutes);
// app.use('/api/proposal', proposalRoutes);

// // Test Route
// app.get('/', (req, res) => {
//   res.send('🚀 OmniGive Backend is Running!');
// });

// // Online Users Track
// const onlineUsers = new Set();

// // --- SOCKET.IO LOGIC ---
// io.on('connection', (socket) => {
//   console.log('🟢 User connected:', socket.id);

//   // 1. User Register
//   socket.on('addUser', (userId) => {
//     if (userId) {
//       socket.userId = userId;
//       socket.join(userId);
//       onlineUsers.add(userId);
//       io.emit('userOnline', userId);
//       console.log(`User ${userId} is Online`);
//     }
//   });

//   // 2. Chat Message
//   socket.on('sendMessage', async (data) => {
//     const { senderId, receiverId, message } = data;
//     if (!senderId || !receiverId || !message) return;

//     try {
//       const newMessage = new Message({ senderId, receiverId, message });
//       await newMessage.save();
//       console.log("✅ Message saved to DB");

//       io.to(receiverId).emit('getMessage', newMessage);
//       io.to(senderId).emit('messageSent', newMessage);

//       // Push Notification (Firebase commented)
//       // const receiver = await User.findById(receiverId);
//       // if (receiver && receiver.fcmToken) {
//       //   const payload = {
//       //     notification: { title: "New Message", body: message },
//       //     token: receiver.fcmToken,
//       //   };
//       //   admin.messaging().send(payload)
//       //     .then(() => console.log("✅ Notification sent"))
//       //     .catch((err) => console.log("❌ Notification error:", err.message));
//       // }

//     } catch (err) {
//       console.error("❌ DB Save Error:", err.message);
//     }
//   });

//   // --- VOICE / VIDEO CALL SIGNALING ---
  
//   // 3. Call Initiate
//   socket.on('callUser', ({ userToCall, signalData, from, name, isVideo }) => {
//     console.log(`📞 Call from ${from} to ${userToCall} (Video: ${isVideo})`);
//     io.to(userToCall).emit('callUser', {
//       signal: signalData,
//       from,
//       name,
//       isVideo,
//     });
//   });

//   // 4. Call Accepted
//   socket.on('answerCall', (data) => {
//     console.log(`📞 Call accepted by ${data.to}`);
//     io.to(data.to).emit('callAccepted', data.signal);
//   });

//   // 5. ICE Candidate Exchange
//   socket.on('iceCandidate', ({ to, candidate }) => {
//     io.to(to).emit('iceCandidate', candidate);
//   });

//   // 6. End Call
//   socket.on('endCall', ({ to }) => {
//     console.log(`📞 Call ended to ${to}`);
//     io.to(to).emit('callEnded');
//   });

//   // 7. Disconnect
//   socket.on('disconnect', () => {
//     if (socket.userId) {
//       onlineUsers.delete(socket.userId);
//       io.emit('userOffline', socket.userId);
//       console.log(`User ${socket.userId} is Offline`);
//     }
//     console.log('🔴 User disconnected:', socket.id);
//   });
// });

// // Server Start
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🔥 Server running on http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
require('dotenv').config();

// Configs
const connectDB = require('./config/db');
// const admin = require('./config/firebase'); // Firebase commented (deployment ke liye)

// Models & Routes
const anonymousRoutes = require('./routes/anonymousRoutes');
const likeRoutes = require('./routes/likeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const giftRoutes = require('./routes/giftRoutes');
const planRoutes = require('./routes/planRoutes');
const Message = require('./models/Message'); 
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const lookingRoutes = require('./routes/lookingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const proposalRoutes = require('./routes/proposalRoutes');

// ✅ NAYA: User Routes import kiya (Preferences ke liye)
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app); 

// ✅ CORS Configuration (Sirf aapki website aur app ko allow karein)
const allowedOrigins = [
 "http://localhost:5173",
  "http://localhost:3000",
  "https://ovmvigive-web.vercel.app"   // Aapki live website
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Socket.IO Setup (CORS ke saath)
const io = new Server(server, {
  cors: { 
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO ko app mein set karein (gift notification ke liye zaroori)
app.set('io', io);

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connect
connectDB();

// ✅ Routes - Sabse pehle register karein
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // ✅ NAYA: Preferences save karne ka route
app.use('/api/looking', lookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gift', giftRoutes); 
app.use('/api/plan', planRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/anonymous', anonymousRoutes);
app.use('/api/proposal', proposalRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 OmniGive Backend is Running!');
});

// Online Users Track
const onlineUsers = new Set();

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // 1. User Register
  socket.on('addUser', (userId) => {
    if (userId) {
      socket.userId = userId;
      socket.join(userId);
      onlineUsers.add(userId);
      io.emit('userOnline', userId);
      console.log(`User ${userId} is Online`);
    }
  });

  // 2. Chat Message
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
    if (!senderId || !receiverId || !message) return;

    try {
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();
      console.log("✅ Message saved to DB");

      io.to(receiverId).emit('getMessage', newMessage);
      io.to(senderId).emit('messageSent', newMessage);

    } catch (err) {
      console.error("❌ DB Save Error:", err.message);
    }
  });

  // --- VOICE / VIDEO CALL SIGNALING ---
  
  // 3. Call Initiate
  socket.on('callUser', ({ userToCall, signalData, from, name, isVideo }) => {
    console.log(`📞 Call from ${from} to ${userToCall} (Video: ${isVideo})`);
    io.to(userToCall).emit('callUser', {
      signal: signalData,
      from,
      name,
      isVideo,
    });
  });

  // 4. Call Accepted
  socket.on('answerCall', (data) => {
    console.log(`📞 Call accepted by ${data.to}`);
    io.to(data.to).emit('callAccepted', data.signal);
  });

  // 5. ICE Candidate Exchange
  socket.on('iceCandidate', ({ to, candidate }) => {
    io.to(to).emit('iceCandidate', candidate);
  });

  // 6. End Call
  socket.on('endCall', ({ to }) => {
    console.log(`📞 Call ended to ${to}`);
    io.to(to).emit('callEnded');
  });

  // 7. Disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('userOffline', socket.userId);
      console.log(`User ${socket.userId} is Offline`);
    }
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});