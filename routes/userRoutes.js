const express = require('express');
const router = express.Router();
const { updatePreferences, getMyProfile } = require('../controllers/userController');
// ✅ Aapne jo middleware bheja hai usko yahan import kiya
const authMiddleware = require('../middleware/authMiddleware'); // Path apne folder ke hisaab se check kar lena

// Preferences update route
router.put('/preferences', authMiddleware, updatePreferences);

// Profile fetch route
router.get('/profile', authMiddleware, getMyProfile);

module.exports = router;