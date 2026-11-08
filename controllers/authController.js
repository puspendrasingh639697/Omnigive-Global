// 

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary'); // ✅ Cloudinary import

const JWT_SECRET = "omnigive_super_secret_key_123";

// Register Function
exports.register = async (req, res) => {
  const { name, email, password, age, gender, lookingFor, bio, city } = req.body;

  try {
    // 1. Check karein ki email pehle se hai ya nahi
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    // 2. Password hash karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Image Cloudinary par upload karein
    let profilePic = "";
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "omnigive_profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer); // ✅ Memory storage se buffer
        });
        profilePic = result.secure_url;
        console.log("✅ Image uploaded:", profilePic);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        // Image fail hone par bhi user create karein (bina image ke)
      }
    }

    // 4. User save karein
    user = new User({
      name, email, password: hashedPassword,
      age, gender, lookingFor, bio, city, profilePic
    });
    await user.save();

    res.status(201).json({ message: "User Registered Successfully", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Login Function
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Email or Password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      message: "Login Successful", token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        age: user.age, 
        gender: user.gender, 
        lookingFor: user.lookingFor,
        profilePic: user.profilePic // ✅ Profile pic bhi bhejein
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};