const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  getAllGifts, 
  sendGift, 
  getGiftHistory, 
  getMyBalance,
  addGift
} = require('../controllers/giftController');
const authMiddleware = require('../middleware/authMiddleware');

// Multer Memory Storage (Cloudinary ke liye buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.get('/all', getAllGifts);
router.post('/add', upload.single('image'), addGift);
router.post('/send', authMiddleware, sendGift);
router.get('/history', authMiddleware, getGiftHistory);
router.get('/my-balance', authMiddleware, getMyBalance);

module.exports = router;