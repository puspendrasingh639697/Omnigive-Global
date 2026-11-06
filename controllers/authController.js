const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "omnigive_super_secret_key_123";

// Register Function
exports.register = async (req, res) => {
  const { name, email, password, age, gender, lookingFor, bio, city } = req.body;
  const profilePic = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      user: { id: user._id, name: user.name, email: user.email, age: user.age, gender: user.gender, lookingFor: user.lookingFor }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};