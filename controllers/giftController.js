const User = require('../models/User');
const Gift = require('../models/Gift');
const GiftTransaction = require('../models/GiftTransaction');
const cloudinary = require('../config/cloudinary');

// 1. Saare Gifts ki List
exports.getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find({ isActive: true });
    res.status(200).json(gifts);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 2. Gift Add (Cloudinary Image Upload)
exports.addGift = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Cloudinary par upload karein (Buffer se)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "omnigive_gifts" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const gift = new Gift({
      name,
      imageUrl: result.secure_url,  // Cloudinary ka URL
      price,
      category: category || 'Basic',
      isActive: true
    });

    await gift.save();
    res.status(201).json({ 
      message: "Gift added successfully", 
      gift 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// 3. Gift Bhejna
exports.sendGift = async (req, res) => {
  const { receiverId, giftId, message } = req.body;
  const senderId = req.user.id;

  try {
    const gift = await Gift.findById(giftId);
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!gift) return res.status(404).json({ error: "Gift not found" });
    if (!sender) return res.status(404).json({ error: "Sender not found" });
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    if (sender.goldCoins < gift.price) {
      return res.status(400).json({ 
        error: "Insufficient coins",
        currentBalance: sender.goldCoins,
        required: gift.price 
      });
    }

    sender.goldCoins -= gift.price;
    sender.totalGiftsSent = (sender.totalGiftsSent || 0) + 1;
    await sender.save();

    receiver.totalGiftsReceived = (receiver.totalGiftsReceived || 0) + 1;
    await receiver.save();

    const transaction = new GiftTransaction({
      senderId, receiverId, giftId,
      coinsSpent: gift.price,
      message: message || ""
    });
    await transaction.save();

    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit("receivedGift", {
        gift, senderName: sender.name, senderAvatar: sender.profilePic,
        message: message || `ne aapko ${gift.name} bheja!`
      });
    }

    res.status(200).json({
      message: "Gift sent successfully",
      gift,
      newBalance: sender.goldCoins,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 4. History
exports.getGiftHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await GiftTransaction.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate('giftId', 'name imageUrl price')
    .populate('senderId', 'name profilePic')
    .populate('receiverId', 'name profilePic')
    .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 5. Balance
exports.getMyBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('goldCoins diamondCoins totalGiftsReceived totalGiftsSent');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};