const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login, googleLogin } = require('../controllers/authController'); // ✅ googleLogin import kiya

// ✅ Memory Storage (Cloudinary ke liye)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Register Route (Email/Password)
router.post('/register', upload.single('profilePic'), register);

// Login Route (Email/Password)
router.post('/login', login);

// ✅ Google Login Route (Firebase Token se)
router.post('/google-login', googleLogin);

module.exports = router;