const Story = require('../models/Story');
const cloudinary = require('../config/cloudinary'); // Aapki cloudinary config
const streamifier = require('streamifier'); // (Optional: Buffer upload ke liye)

// ✅ 1. Naya Story Add Karne Ke Liye (Image Upload)
exports.addStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image or video" });
    }

    // Cloudinary par upload karo (Agar aapke paas streamifier nahi hai, toh direct upload use karo)
    const uploadFromBuffer = (req) => {
      return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
          { folder: "omnigive_stories" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
      });
    };

    const result = await uploadFromBuffer(req);

    // Nayi story database me save karo
    const newStory = new Story({
      user: req.user.id || req.user._id,
      mediaUrl: result.secure_url,
      mediaType: result.resource_type === 'video' ? 'video' : 'image'
    });

    await newStory.save();
    res.status(201).json({ message: "Story added successfully", story: newStory });

  } catch (error) {
    console.error("Story upload error:", error);
    res.status(500).json({ error: "Failed to add story" });
  }
};

// ✅ 2. Saari Stories Fetch Karne Ke Liye (Home screen par dikhane ke liye)
exports.getAllStories = async (req, res) => {
  try {
    // Saari stories laao (24 ghante ke andar wali)
    const stories = await Story.find()
      .populate('user', 'name profilePic') // User ka naam aur photo bhi laao
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Stories fetched", count: stories.length, stories });
  } catch (error) {
    console.error("Fetch stories error:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};