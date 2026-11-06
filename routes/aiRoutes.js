const express = require('express');
const router = express.Router();
const { 
  checkCompatibility, 
  generateIceBreaker, 
  generateBio 
} = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ AI Endpoints (Login required)
router.post('/compatibility', authMiddleware, checkCompatibility);
router.post('/icebreaker', authMiddleware, generateIceBreaker);
router.post('/generate-bio', authMiddleware, generateBio);

module.exports = router;