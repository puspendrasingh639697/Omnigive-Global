const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getMyMessages, 
  getUserMessages,
  deleteMessage
} = require('../controllers/anonymousController');
const authMiddleware = require('../middleware/authMiddleware');

// Public - koi bhi anonymous message bhej sakta hai
router.post('/send', sendMessage);

// Public - kisi bhi user ke messages dekh sakte hain
router.get('/user/:userId', getUserMessages);

// Protected - apne messages dekhne ke liye (login zaroori)
router.get('/my-messages', authMiddleware, getMyMessages);
router.delete('/:messageId', authMiddleware, deleteMessage);

module.exports = router;