const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary'); // ✅ Cloudinary import
const admin = require('../config/firebase'); // ✅ Firebase Admin import (Google Login ke liye)

const JWT_SECRET = "omnigive_super_secret_key_123";

// ============================================
// 1. REGISTER FUNCTION (Email/Password)
// ============================================
exports.register = async (req, res) => {
  const { name, email, password, age, gender, lookingFor, bio, city } = req.body;

  try {
    // Check karein ki email pehle se hai ya nahi
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    // Password hash karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Image Cloudinary par upload karein
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
          uploadStream.end(req.file.buffer);
        });
        profilePic = result.secure_url;
        console.log("✅ Image uploaded:", profilePic);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
      }
    }

    // User save karein
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

// ============================================
// 2. LOGIN FUNCTION (Email/Password)
// ============================================
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
        profilePic: user.profilePic 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ============================================
// 3. GOOGLE LOGIN FUNCTION (Web + Mobile)
// ============================================
exports.googleLogin = async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ error: "Firebase token required" });
  }

  try {
    // 1. Firebase se aaye token ko verify karein
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { email, name, picture } = decodedToken;

    // 2. Check karein ki user MongoDB mein pehle se hai ya nahi
    let user = await User.findOne({ email: email });

    if (!user) {
      // 3. Agar naya user hai, toh database mein save karein
      user = new User({
        name: name || "Google User",
        email: email,
        password: "google_oauth_dummy_password",
        profilePic: picture || ""
      });
      await user.save();
      console.log("🆕 New Google User Created:", email);
    } else {
      console.log("👤 Existing Google User Logged In:", email);
    }

    // 4. Apna Custom JWT Token generate karein
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: "Google Login Successful",
      token: token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        profilePic: user.profilePic,
        age: user.age,
        gender: user.gender,
        lookingFor: user.lookingFor
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(401).json({ error: "Invalid Firebase Token" });
  }
};