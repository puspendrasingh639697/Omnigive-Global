const express = require('express');
const router = express.Router();
const { getDiscoveries } = require('../controllers/lookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Route ke andar koi logic nahi hoga, wo controller file me hai
router.get('/discover', authMiddleware, getDiscoveries);

module.exports = router;