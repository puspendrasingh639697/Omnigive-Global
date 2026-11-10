


// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');
// require('dotenv').config();

// // Configs
// const connectDB = require('./config/db');

// // Models & Routes
// const storyRoutes = require('./routes/storyRoutes');
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
// const userRoutes = require('./routes/userRoutes');

// const app = express();
// const server = http.createServer(app); 

// // ✅ CORS Configuration
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://ovmvigive-web.vercel.app"
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

// // Socket.IO Setup
// const io = new Server(server, {
//   cors: { 
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// // Socket.IO ko app mein set karein
// app.set('io', io);

// // Middlewares
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Database Connect
// connectDB();

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/looking', lookingRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/gift', giftRoutes); 
// app.use('/api/plan', planRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/like', likeRoutes);
// app.use('/api/anonymous', anonymousRoutes);
// app.use('/api/proposal', proposalRoutes);
// app.use('/api/story', storyRoutes);

// // Test Route
// app.get('/', (req, res) => {
//   res.send('🚀 OmniGive Backend is Running!');
// });

// // Online Users Track
// const onlineUsers = new Set();

// // --- SOCKET.IO LOGIC ---
// io.on('connection', (socket) => {
//   console.log('🟢 User connected:', socket.id);

//   // 1. User Register & Online Status
//   socket.on('addUser', async (userId) => {
//     if (userId) {
//       const uId = userId.toString(); // ✅ String me convert karo
//       socket.userId = uId;
      
//       // ✅ Room Join karo (String ID se)
//       socket.join(uId); 
      
//       onlineUsers.add(uId);
      
//       await User.findByIdAndUpdate(uId, { isOnline: true });
      
//       io.emit('userOnline', uId);
//       console.log(`User ${uId} is Online and joined room: ${uId}`);
//     }
//   });

//   // 2. Chat Message (FIXED)
//   socket.on('sendMessage', async (data) => {
//     const { senderId, receiverId, message } = data;
//     if (!senderId || !receiverId || !message) return;

//     try {
//       const newMessage = new Message({ senderId, receiverId, message });
//       await newMessage.save();
//       console.log(`✅ Message from ${senderId} to ${receiverId}: ${message}`);

//       // ✅ RECEIVER KO MESSAGE BHEJO (String me convert karke)
//       io.to(receiverId.toString()).emit('getMessage', newMessage);
      
//       // Sender ko confirm karo
//       io.to(senderId.toString()).emit('messageSent', newMessage);

//     } catch (err) {
//       console.error("❌ DB Save Error:", err.message);
//     }
//   });

//   // 3. Typing Status
//   socket.on('typing', ({ senderId, receiverId }) => {
//     io.to(receiverId.toString()).emit('userTyping', { senderId });
//   });

//   socket.on('stopTyping', ({ senderId, receiverId }) => {
//     io.to(receiverId.toString()).emit('userStopTyping', { senderId });
//   });

//   // --- VOICE / VIDEO CALL SIGNALING ---
  
//   // 4. Call Initiate
//   socket.on('callUser', ({ userToCall, signalData, from, name, isVideo }) => {
//     console.log(`📞 Call from ${from} to ${userToCall} (Video: ${isVideo})`);
//     io.to(userToCall.toString()).emit('callUser', {
//       signal: signalData,
//       from,
//       name,
//       isVideo,
//     });
//   });

//   // 5. Call Accepted
//   socket.on('answerCall', (data) => {
//     console.log(`📞 Call accepted by ${data.to}`);
//     io.to(data.to.toString()).emit('callAccepted', data.signal);
//   });

//   // 6. ICE Candidate Exchange (WebRTC Connection ke liye)
//   socket.on('iceCandidate', ({ to, candidate }) => {
//     io.to(to.toString()).emit('iceCandidate', candidate);
//   });

//   // 7. End Call
//   socket.on('endCall', ({ to }) => {
//     console.log(`📞 Call ended to ${to}`);
//     io.to(to.toString()).emit('callEnded');
//   });

//   // 8. Disconnect & Offline Status
//   socket.on('disconnect', async () => {
//     if (socket.userId) {
//       onlineUsers.delete(socket.userId);
      
//       // Database me offline true karo aur last seen update karo
//       await User.findByIdAndUpdate(socket.userId, { 
//         isOnline: false, 
//         lastSeen: Date.now() 
//       });
      
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

// Models & Routes
const storyRoutes = require('./routes/storyRoutes');
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
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app); 

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ovmvigive-web.vercel.app"
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

// Socket.IO Setup
const io = new Server(server, {
  cors: { 
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO ko app mein set karein
app.set('io', io);

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connect
connectDB();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/looking', lookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gift', giftRoutes); 
app.use('/api/plan', planRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/anonymous', anonymousRoutes);
app.use('/api/proposal', proposalRoutes);
app.use('/api/story', storyRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 OmniGive Backend is Running!');
});

// Online Users Track
const onlineUsers = new Set();

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // 1. User Register & Online Status
  socket.on('addUser', async (userId) => {
    if (userId) {
      const uId = userId.toString(); // ✅ String conversion
      socket.userId = uId;
      
      socket.join(uId); // ✅ Room join
      onlineUsers.add(uId);
      
      try {
        await User.findByIdAndUpdate(uId, { isOnline: true });
      } catch (err) {
        console.log("Error updating online:", err.message);
      }
      
      io.emit('userOnline', uId);
      console.log(`✅ User ${uId} is Online and joined room: ${uId}`);
    }
  });

  // 2. Chat Message (100% Working)
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
    
    // Data validation
    if (!senderId || !receiverId || !message) {
      console.log("❌ Invalid message data:", data);
      return;
    }

    try {
      const newMessage = new Message({ 
        senderId: senderId.toString(), 
        receiverId: receiverId.toString(), 
        message 
      });
      await newMessage.save();
      
      console.log(`✅ Message Saved | From: ${senderId} | To: ${receiverId}`);

      // 1. Specific receiver ko bhejo
      io.to(receiverId.toString()).emit('getMessage', newMessage);
      
      // 2. Sender ko confirm karo
      io.to(senderId.toString()).emit('messageSent', newMessage);

      // 🚨 MAGIC LINE: Testing ke liye (Agar room join fail ho jaye toh yeh sabko bhej dega)
      io.emit('getMessage', newMessage); 
      
    } catch (err) {
      console.error("❌ DB Save Error:", err.message);
    }
  });

  // 3. Typing Status
  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(receiverId.toString()).emit('userTyping', { senderId });
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    io.to(receiverId.toString()).emit('userStopTyping', { senderId });
  });

  // --- VOICE / VIDEO CALL SIGNALING ---
  
  socket.on('callUser', ({ userToCall, signalData, from, name, isVideo }) => {
    console.log(`📞 Call from ${from} to ${userToCall} (Video: ${isVideo})`);
    io.to(userToCall.toString()).emit('callUser', {
      signal: signalData,
      from,
      name,
      isVideo,
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to.toString()).emit('callAccepted', data.signal);
  });

  socket.on('iceCandidate', ({ to, candidate }) => {
    io.to(to.toString()).emit('iceCandidate', candidate);
  });

  socket.on('endCall', ({ to }) => {
    io.to(to.toString()).emit('callEnded');
  });

  // 8. Disconnect & Offline Status
  socket.on('disconnect', async () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      try {
        await User.findByIdAndUpdate(socket.userId, { 
          isOnline: false, 
          lastSeen: Date.now() 
        });
      } catch (err) {}
      
      io.emit('userOffline', socket.userId);
      console.log(`🔴 User ${socket.userId} is Offline`);
    }
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});