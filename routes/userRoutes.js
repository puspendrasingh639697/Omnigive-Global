const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controller se saare functions import karo
const { 
  updatePreferences, 
  getMyProfile, 
  getOptions, 
  getUserProfileById,
  updateProfile // ✅ Yeh naya function import karna zaroori hai
} = require('../controllers/userController');

const auth = require('../middleware/authMiddleware');

// Image upload ke liye multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// 1. Preferences save karne ke liye
router.put('/preferences', auth, updatePreferences);

// 2. Apni profile dekhne ke liye
router.get('/profile', auth, getMyProfile);

// 3. Options fetch karne ke liye
router.get('/options', auth, getOptions);

// 4. Kisi specific user ki profile dekhne ke liye
router.get('/profile/:id', auth, getUserProfileById);

// 5. ✅ NAYA: Profile update karne ke liye (Image upload ke saath)
router.put('/update', auth, upload.single('profilePic'), updateProfile);

module.exports = router;