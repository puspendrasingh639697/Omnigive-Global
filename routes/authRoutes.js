const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { register, login } = require('../controllers/authController');

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads' folder exists!
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Register route
router.post('/register', upload.single('profilePic'), register);

// Login route
router.post('/login', login);

module.exports = router;