const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// GET: /api/chat/:otherUserId (Dono users ke beech ke messages)
router.get('/:otherUserId', authMiddleware, getMessages);

module.exports = router;