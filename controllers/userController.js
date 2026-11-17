



const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.getOptions = async (req, res) => {
  try {
    const options = {
      beliefs: ['✨ Spiritual', '🌌 Agnostic', '🔮 Atheist', '👑 Traditional'],
      vibes: ['🌙 Late-night Talks', '☕ Coffee & Books', '🎨 Elite Art & Poetry', '🚀 Tech & Philosophy'],
      intents: ['💬 Deep Midnight Chat', '🌍 Global Friendship', '🎭 Secret Confessions', '🧠 Philosophical Debates'],
      ageRanges: ['18 - 24 yrs', '25 - 32 yrs', '33 - 40 yrs', '40+ yrs (Elite)']
    };

    res.status(200).json({ message: "Options fetched successfully", data: options });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch options" });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { belief, vibe, intent, ageRange, interests } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id, 
      { 
        $set: { 
          preferences: { belief, vibe, intent, ageRange, interests: interests || [] } 
        } 
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Preferences saved successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
};

// ==========================================
// 2. PROFILE APIs
// ==========================================

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User profile fetched", user: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, city, age, gender, lookingFor, fcmToken } = req.body;
    let profilePic = req.body.profilePic; 

    if (req.file) {
      const uploadFromBuffer = (req) => {
        return new Promise((resolve, reject) => {
          const cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "omnigive_profiles" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
        });
      };
      const result = await uploadFromBuffer(req);
      profilePic = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
      { 
        $set: { 
          name: name || undefined, 
          bio: bio || undefined, 
          city: city || undefined,
          age: age || undefined,
          gender: gender || undefined,
          lookingFor: lookingFor || undefined,
          profilePic: profilePic || undefined,
          fcmToken: fcmToken || undefined
        } 
      },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// ==========================================
// 3. DISCOVERY & MATCHMAKING API
// ==========================================

exports.getDiscoveries = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    let matchQuery = { _id: { $ne: currentUserId } }; 
    
    if (currentUser.lookingFor === 'Male') matchQuery.gender = 'Male';
    else if (currentUser.lookingFor === 'Female') matchQuery.gender = 'Female';

    // ✅ Blocked users ko discovery se hata do
    if (currentUser.blockedUsers && currentUser.blockedUsers.length > 0) {
      matchQuery._id = { 
        $ne: currentUserId, 
        $nin: currentUser.blockedUsers 
      };
    }

    const allMatches = await User.find(matchQuery).select('-password').limit(50); 

    if (allMatches.length === 0) {
      return res.status(200).json({ message: "No users found", count: 0, users: [] });
    }

    const userPrefs = currentUser.preferences || {};
    const userInterests = userPrefs.interests || [];

    let scoredMatches = allMatches.map((user) => {
      const otherPrefs = user.preferences || {};
      let matchScore = 0;

      if (otherPrefs.belief && otherPrefs.belief === userPrefs.belief) matchScore += 1;
      if (otherPrefs.vibe && otherPrefs.vibe === userPrefs.vibe) matchScore += 1;
      if (otherPrefs.intent && otherPrefs.intent === userPrefs.intent) matchScore += 1;
      if (otherPrefs.ageRange && otherPrefs.ageRange === userPrefs.ageRange) matchScore += 1;

      const otherInterests = otherPrefs.interests || [];
      const commonInterests = otherInterests.filter(interest => userInterests.includes(interest));
      if (commonInterests.length > 0) matchScore += (commonInterests.length * 2);

      return { ...user.toObject(), matchScore: matchScore };
    });

    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    const finalMatches = scoredMatches.slice(0, 20);

    res.status(200).json({ 
      message: "Discoveries fetched with match score", 
      count: finalMatches.length, 
      users: finalMatches 
    });

  } catch (error) {
    console.error("Discoveries error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// 4. ✅ NAYA: BLOCK & REPORT APIs
// ==========================================

// ---------- BLOCK USER ----------
exports.blockUser = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { blockedUserId } = req.body;

    if (!blockedUserId) {
      return res.status(400).json({ success: false, error: "blockedUserId is required" });
    }

    if (currentUserId === blockedUserId) {
      return res.status(400).json({ success: false, error: "You cannot block yourself" });
    }

    const blockedUserExists = await User.findById(blockedUserId);
    if (!blockedUserExists) {
      return res.status(404).json({ success: false, error: "User to block not found" });
    }

    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { blockedUsers: blockedUserId } },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "User blocked successfully" 
    });

  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ success: false, error: "Failed to block user" });
  }
};

// ---------- UNBLOCK USER ----------
exports.unblockUser = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { blockedUserId } = req.body;

    if (!blockedUserId) {
      return res.status(400).json({ success: false, error: "blockedUserId is required" });
    }

    await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { blockedUsers: blockedUserId } },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "User unblocked successfully" 
    });

  } catch (error) {
    console.error("Unblock user error:", error);
    res.status(500).json({ success: false, error: "Failed to unblock user" });
  }
};

// ---------- REPORT USER ----------
exports.reportUser = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { reportedUserId, reason } = req.body;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ 
        success: false, 
        error: "reportedUserId and reason are required" 
      });
    }

    if (currentUserId === reportedUserId) {
      return res.status(400).json({ success: false, error: "You cannot report yourself" });
    }

    const reportedUserExists = await User.findById(reportedUserId);
    if (!reportedUserExists) {
      return res.status(404).json({ success: false, error: "User to report not found" });
    }

    // Simple approach: User model me reportedUsers array me add karo
    // (agar tum chahte ho ki reason bhi save ho, toh alag Report model banao)
    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { reportedUsers: reportedUserId } },
      { new: true }
    );

    console.log(`📢 Report: User ${currentUserId} reported ${reportedUserId}. Reason: ${reason}`);

    res.status(200).json({ 
      success: true, 
      message: "Report submitted successfully. Our team will review it." 
    });

  } catch (error) {
    console.error("Report user error:", error);
    res.status(500).json({ success: false, error: "Failed to submit report" });
  }
};