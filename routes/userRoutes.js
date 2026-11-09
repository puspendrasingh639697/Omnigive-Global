const express = require('express');
const router = express.Router();

// Controller se saare functions import karo (getOptions bhi)
const { updatePreferences, getMyProfile, getOptions } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// 1. Preferences save karne ke liye
router.put('/preferences', auth, updatePreferences);

// 2. Profile dekhne ke liye
router.get('/profile', auth, getMyProfile);

// 3. ✅ NAYA: Options fetch karne ke liye (Yeh frontend screen par list dikhayega)
router.get('/options', auth, getOptions);

module.exports = router;