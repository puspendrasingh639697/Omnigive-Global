const Message = require('../models/Message');

// Dono users ke beech ke purane messages nikaalne ke liye
exports.getMessages = async (req, res) => {
  try {
    // req.user me ID `id` ya `_id` ke naam se ho sakti hai
    const myId = req.user.id || req.user._id; 
    const otherId = req.params.otherUserId; 

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 }); // Purane messages pehle

    // ✅ Frontend ke liye format theek karo (wo expect kar raha hai { messages: [...] })
    res.status(200).json({ messages });

  } catch (error) {
    console.error("Fetch Messages Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};