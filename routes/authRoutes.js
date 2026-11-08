const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login, googleLogin } = require('../controllers/authController');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/register', upload.single('profilePic'), register);
router.post('/login', login);
router.post('/google-login', googleLogin);

module.exports = router;