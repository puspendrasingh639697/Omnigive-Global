const AnonymousMessage = require('../models/AnonymousMessage');
const User = require('../models/User');

// ✅ 1. Anonymous Message Bhejein (Koi bhi bhej sakta hai)
exports.sendMessage = async (req, res) => {
  const { receiverUsername, message } = req.body;

  try {
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    // Receiver ko username ya ID se dhoondhein
    const receiver = await User.findOne({ 
      $or: [
        { _id: receiverUsername.length === 24 ? receiverUsername : null },
        { name: new RegExp(receiverUsername, 'i') }
      ]
    });

    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    const newMessage = new AnonymousMessage({
      receiverId: receiver._id,
      message: message.trim(),
      senderIp: req.ip
    });
    await newMessage.save();

    res.status(201).json({ 
      message: "Message sent anonymously!",
      success: true 
    });
  } catch (error) {
    console.error("Send Anonymous Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ 2. Apne Liye Aaye Anonymous Messages Dekhein
exports.getMyMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await AnonymousMessage.find({ receiverId: userId })
      .sort({ createdAt: -1 });

    // Unread count
    const unreadCount = messages.filter(m => !m.isRead).length;

    // Mark as read
    await AnonymousMessage.updateMany(
      { receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ 
      totalMessages: messages.length,
      unreadCount,
      messages 
    });
  } catch (error) {
    console.error("Get Anonymous Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ 3. Kisi Aur Ke Messages Dekhein (Public - profile pehchanne ke liye)
exports.getUserMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await AnonymousMessage.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('message createdAt');

    res.status(200).json({ 
      totalMessages: messages.length,
      messages 
    });
  } catch (error) {
    console.error("Get User Anonymous Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ 4. Message Delete Karein
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const deleted = await AnonymousMessage.deleteOne({ 
      _id: messageId, 
      receiverId: userId 
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("Delete Anonymous Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};