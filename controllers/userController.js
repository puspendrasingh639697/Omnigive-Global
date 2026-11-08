const User = require('../models/User');

// ✅ 1. User Preferences Update Karne Ke Liye (Onboarding Screen)
exports.updatePreferences = async (req, res) => {
  try {
    const { belief, vibe, intent, ageRange, interests } = req.body;

    // req.user.id aayega aapke auth middleware se (JWT verify hone ke baad)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id, 
      { 
        $set: { 
          preferences: { 
            belief, 
            vibe, 
            intent, 
            ageRange, 
            interests: interests || [] 
          } 
        } 
      },
      { new: true } // Update hone ke baad naya data return karega
    ).select('-password'); // Password ko response se hata diya

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      message: "Preferences saved successfully", 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
};

// ✅ 2. Current Logged-in User Ki Profile Fetch Karne Ke Liye
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};