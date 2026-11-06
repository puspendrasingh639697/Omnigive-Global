const Message = require('../models/Message');

// Dono users ke beech ke purane messages nikaalne ke liye
exports.getMessages = async (req, res) => {
  try {
    const myId = req.user.id; // Middleware se aapki ID
    const otherId = req.params.otherUserId; // URL se dusre user ki ID

    // Database se wo saare messages nikalo jo ya toh aapne bheje hain
    // ya aapko bheje gaye hain, aur dono ke beech mein hain
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 }); // Purane messages pehle (time ke hisaab se)

    res.status(200).json(messages);

  } catch (error) {
    console.error("Fetch Messages Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};