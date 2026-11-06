const express = require('express');
const router = express.Router();
const { 
  sendLike, 
  getWhoLikedMe, 
  getMyLikes, 
  getMatches,
  unlike 
} = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send', authMiddleware, sendLike);
router.get('/who-liked-me', authMiddleware, getWhoLikedMe);
router.get('/my-likes', authMiddleware, getMyLikes);
router.get('/matches', authMiddleware, getMatches);
router.delete('/:likeId', authMiddleware, unlike);

module.exports = router;