const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addStory, getAllStories } = require('../controllers/storyController');
const auth = require('../middleware/authMiddleware');

// Memory storage for upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Route: Story Upload (Image/Video)
router.post('/add', auth, upload.single('media'), addStory);

// Route: Saari stories fetch karne ke liye
router.get('/all', auth, getAllStories);

module.exports = router;