

// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');
// require('dotenv').config();

// // Configs
// const connectDB = require('./config/db');
// const admin = require('./config/firebase'); // ✅ Firebase Admin import kiya

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
//   },
//   pingTimeout: 60000,
//   pingInterval: 25000
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
//       const uId = userId.toString(); 
//       socket.userId = uId;
      
//       socket.join(uId); 
//       onlineUsers.add(uId);
      
//       try {
//         await User.findByIdAndUpdate(uId, { isOnline: true });
//       } catch (err) {
//         console.log("Error updating online:", err.message);
//       }
      
//       io.emit('userOnline', uId);
//       console.log(`✅ User ${uId} is Online and joined room: ${uId}`);
//     }
//   });

//   // 2. Chat Message (With FCM Notification)
//   socket.on('sendMessage', async (data) => {
//     const { senderId, receiverId, message } = data;
    
//     if (!senderId || !receiverId || !message) {
//       console.log("❌ Invalid message data:", data);
//       return;
//     }

//     // ✅ NAYA: BLOCK CHECK (sabse pehle — message emit/save se pehle)
//     try {
//       const sender = await User.findById(senderId).select('blockedUsers');
//       const receiver = await User.findById(receiverId).select('blockedUsers');

//       if (!sender || !receiver) {
//         socket.emit('messageError', { success: false, error: 'User not found' });
//         return;
//       }

//       const senderBlockedReceiver = (sender.blockedUsers || []).some(
//         (id) => id.toString() === receiverId.toString()
//       );
//       const receiverBlockedSender = (receiver.blockedUsers || []).some(
//         (id) => id.toString() === senderId.toString()
//       );

//       if (senderBlockedReceiver || receiverBlockedSender) {
//         console.log(`🚫 Blocked: ${senderId} <-> ${receiverId}. Message not sent.`);
//         socket.emit('messageError', { 
//           success: false, 
//           error: senderBlockedReceiver 
//             ? 'You have blocked this user. Unblock to send messages.' 
//             : 'This user has blocked you. Message cannot be sent.' 
//         });
//         return; // ❌ Message emit/save NAHI hoga
//       }
//     } catch (blockCheckErr) {
//       console.error("❌ Block check error:", blockCheckErr.message);
//       socket.emit('messageError', { success: false, error: 'Unable to verify block status.' });
//       return;
//     }

//     const tempMessage = {
//       _id: Date.now().toString(),
//       senderId: senderId.toString(),
//       receiverId: receiverId.toString(),
//       message: message,
//       createdAt: new Date()
//     };

//     // Message Emit karo (sirf sender aur receiver ko)
//     io.to(receiverId.toString()).emit('getMessage', tempMessage);
//     io.to(senderId.toString()).emit('messageSent', tempMessage);
//     // ❌ Testing line `io.emit('getMessage', tempMessage);` HATA DIYA (block bypass + privacy leak)
//     console.log(`🚀 Message Emitted`);

//     // Database me save karo
//     try {
//       const newMessage = new Message({ 
//         senderId: senderId.toString(), 
//         receiverId: receiverId.toString(), 
//         message 
//       });
//       await newMessage.save();
//       console.log(`✅ Message Saved to DB`);
//     } catch (err) {
//       console.error("❌ DB Save Error:", err.message);
//     }

//     // ✅ FCM Push Notification Bhejo
//     try {
//       const receiver = await User.findById(receiverId);
//       const sender = await User.findById(senderId);
      
//       if (receiver && receiver.fcmToken) {
//         const payload = {
//           notification: {
//             title: `New Message from ${sender ? sender.name : 'Someone'} 💬`,
//             body: message,
//           },
//           token: receiver.fcmToken,
//         };
        
//         await admin.messaging().send(payload);
//         console.log("✅ Chat Notification Sent to:", receiver.name);
//       }
//     } catch (error) {
//       console.log("❌ Notification Error:", error.message);
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
  
//   socket.on('callUser', async ({ userToCall, signalData, from, name, isVideo }) => {
//     console.log(`📞 Call from ${from} to ${userToCall} (Video: ${isVideo})`);
    
//     // Call Signal Emit
//     io.to(userToCall.toString()).emit('callUser', {
//       signal: signalData,
//       from,
//       name,
//       isVideo,
//     });

//     // ✅ FCM Push Notification Bhejo (Incoming Call)
//     try {
//       const receiver = await User.findById(userToCall);
//       if (receiver && receiver.fcmToken) {
//         const payload = {
//           notification: {
//             title: `Incoming ${isVideo ? 'Video' : 'Audio'} Call from ${name} 📞`,
//             body: `Tap to answer the call.`,
//           },
//           token: receiver.fcmToken,
//         };
//         await admin.messaging().send(payload);
//         console.log("✅ Call Notification Sent");
//       }
//     } catch (error) {
//       console.log("❌ Call Notification Error:", error.message);
//     }
//   });

//   socket.on('answerCall', (data) => {
//     io.to(data.to.toString()).emit('callAccepted', data.signal);
//   });

//   socket.on('iceCandidate', ({ to, candidate }) => {
//     io.to(to.toString()).emit('iceCandidate', candidate);
//   });

//   socket.on('endCall', ({ to }) => {
//     io.to(to.toString()).emit('callEnded');
//   });

//   // 8. Disconnect & Offline Status
//   socket.on('disconnect', async () => {
//     if (socket.userId) {
//       onlineUsers.delete(socket.userId);
      
//       try {
//         await User.findByIdAndUpdate(socket.userId, { 
//           isOnline: false, 
//           lastSeen: Date.now() 
//         });
//       } catch (err) {}
      
//       io.emit('userOffline', socket.userId);
//       console.log(`🔴 User ${socket.userId} is Offline`);
//     }
//     console.log('🔴 Socket disconnected:', socket.id);
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
const admin = require('./config/firebase');

// Models & Routes
const storyRoutes = require('./routes/storyRoutes');
const anonymousRoutes = require('./routes/anonymousRoutes');
const likeRoutes = require('./routes/likeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const giftRoutes = require('./routes/giftRoutes');
const planRoutes = require('./routes/planRoutes');
const Message = require('./models/Message'); 
const User = require('./models/User');
const Notification = require('./models/Notification'); // ✅ NAYA
const authRoutes = require('./routes/authRoutes');
const lookingRoutes = require('./routes/lookingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // ✅ NAYA

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
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

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
app.use('/api/notification', notificationRoutes); // ✅ NAYA

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
      const uId = userId.toString(); 
      socket.userId = uId;
      
      socket.join(uId); 
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

  // 2. Chat Message (With FCM + Notification DB Save)
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
    
    if (!senderId || !receiverId || !message) {
      console.log("❌ Invalid message data:", data);
      return;
    }

    // ✅ BLOCK CHECK (sabse pehle)
    try {
      const sender = await User.findById(senderId).select('blockedUsers');
      const receiver = await User.findById(receiverId).select('blockedUsers');

      if (!sender || !receiver) {
        socket.emit('messageError', { success: false, error: 'User not found' });
        return;
      }

      const senderBlockedReceiver = (sender.blockedUsers || []).some(
        (id) => id.toString() === receiverId.toString()
      );
      const receiverBlockedSender = (receiver.blockedUsers || []).some(
        (id) => id.toString() === senderId.toString()
      );

      if (senderBlockedReceiver || receiverBlockedSender) {
        console.log(`🚫 Blocked: ${senderId} <-> ${receiverId}. Message not sent.`);
        socket.emit('messageError', { 
          success: false, 
          error: senderBlockedReceiver 
            ? 'You have blocked this user. Unblock to send messages.' 
            : 'This user has blocked you. Message cannot be sent.' 
        });
        return;
      }
    } catch (blockCheckErr) {
      console.error("❌ Block check error:", blockCheckErr.message);
      socket.emit('messageError', { success: false, error: 'Unable to verify block status.' });
      return;
    }

    const tempMessage = {
      _id: Date.now().toString(),
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      message: message,
      createdAt: new Date()
    };

    // Message Emit karo (sirf sender aur receiver ko)
    io.to(receiverId.toString()).emit('getMessage', tempMessage);
    io.to(senderId.toString()).emit('messageSent', tempMessage);
    console.log(`🚀 Message Emitted`);

    // Database me save karo
    try {
      const newMessage = new Message({ 
        senderId: senderId.toString(), 
        receiverId: receiverId.toString(), 
        message 
      });
      await newMessage.save();
      console.log(`✅ Message Saved to DB`);
    } catch (err) {
      console.error("❌ DB Save Error:", err.message);
    }

    // ✅ FCM + Notification DB Save
    try {
      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);
      
      if (receiver) {
        const notifTitle = `New Message from ${sender ? sender.name : 'Someone'} 💬`;
        
        // ✅ 1. Notification DB me save karo
        const newNotif = await Notification.create({
          recipient: receiverId,
          sender: senderId,
          type: 'message',
          title: notifTitle,
          body: message,
          data: { chatWith: senderId.toString() },
          isRead: false,
        });

        // ✅ 2. Real-time socket emit (agar app khula ho)
        io.to(receiverId.toString()).emit('newNotification', {
          _id: newNotif._id,
          type: 'message',
          title: notifTitle,
          body: message,
          sender: sender ? { name: sender.name, profilePic: sender.profilePic } : null,
          data: { chatWith: senderId.toString() },
          isRead: false,
          createdAt: newNotif.createdAt,
        });

        // ✅ 3. FCM push bhejo
        if (receiver.fcmToken) {
          await admin.messaging().send({
            notification: {
              title: notifTitle,
              body: message,
            },
            token: receiver.fcmToken,
          });
          console.log("✅ Chat Notification Sent to:", receiver.name);
        }
      }
    } catch (error) {
      console.log("❌ Notification Error:", error.message);
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
  
  socket.on('callUser', async ({ userToCall, signalData, from, name, isVideo }) => {
    console.log(`📞 Call from ${from} to ${userToCall} (Video: ${isVideo})`);
    
    // Call Signal Emit
    io.to(userToCall.toString()).emit('callUser', {
      signal: signalData,
      from,
      name,
      isVideo,
    });

    // ✅ FCM + Notification DB Save (Incoming Call)
    try {
      const receiver = await User.findById(userToCall);
      if (receiver) {
        const callTitle = `Incoming ${isVideo ? 'Video' : 'Audio'} Call from ${name} 📞`;
        
        // ✅ 1. Notification DB me save
        const newNotif = await Notification.create({
          recipient: userToCall,
          sender: from,
          type: 'call',
          title: callTitle,
          body: `Tap to call back.`,
          data: { callWith: from.toString(), isVideo },
          isRead: false,
        });

        // ✅ 2. Real-time emit
        io.to(userToCall.toString()).emit('newNotification', {
          _id: newNotif._id,
          type: 'call',
          title: callTitle,
          body: `Tap to call back.`,
          sender: { name },
          data: { callWith: from.toString(), isVideo },
          isRead: false,
          createdAt: newNotif.createdAt,
        });

        // ✅ 3. FCM push
        if (receiver.fcmToken) {
          await admin.messaging().send({
            notification: {
              title: callTitle,
              body: `Tap to answer the call.`,
            },
            token: receiver.fcmToken,
          });
          console.log("✅ Call Notification Sent");
        }
      }
    } catch (error) {
      console.log("❌ Call Notification Error:", error.message);
    }
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