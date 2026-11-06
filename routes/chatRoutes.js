const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// GET: /api/chat/:otherUserId (Dono users ke beech ke messages)
router.get('/:otherUserId', authMiddleware, async (req, res) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.otherUserId;

    // Dono ke beech ke messages dhundhein
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 }); // Purane pehle

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;