// const User = require('../models/User');

// // ✅ 1. User Preferences Update Karne Ke Liye (Onboarding Screen)
// exports.updatePreferences = async (req, res) => {
//   try {
//     const { belief, vibe, intent, ageRange, interests } = req.body;

//     // req.user.id aayega aapke auth middleware se (JWT verify hone ke baad)
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id || req.user._id, 
//       { 
//         $set: { 
//           preferences: { 
//             belief, 
//             vibe, 
//             intent, 
//             ageRange, 
//             interests: interests || [] 
//           } 
//         } 
//       },
//       { new: true } // Update hone ke baad naya data return karega
//     ).select('-password'); // Password ko response se hata diya

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ 
//       message: "Preferences saved successfully", 
//       user: updatedUser 
//     });

//   } catch (error) {
//     console.error("Error updating preferences:", error);
//     res.status(500).json({ error: "Failed to save preferences" });
//   }
// };

// // ✅ 2. Current Logged-in User Ki Profile Fetch Karne Ke Liye
// exports.getMyProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id || req.user._id).select('-password');
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({ error: "Failed to fetch profile" });
//   }
// };


const User = require('../models/User');

exports.getDiscoveries = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    console.log("Current User Looking For:", currentUser.lookingFor);

    let matchQuery = { _id: { $ne: currentUserId } }; 
    
    // Gender Filter
    if (currentUser.lookingFor === 'Male') matchQuery.gender = 'Male';
    else if (currentUser.lookingFor === 'Female') matchQuery.gender = 'Female';

    const allMatches = await User.find(matchQuery).select('-password').limit(50); 
    console.log("Total users found by Gender filter:", allMatches.length);

    if (allMatches.length === 0) {
      return res.status(200).json({ 
        message: "No users found for your gender preference. Invite more users!", 
        count: 0, 
        users: [] 
      });
    }

    const userPrefs = currentUser.preferences || {};
    const userInterests = userPrefs.interests || [];

    // Matching Algorithm (Score calculation)
    let scoredMatches = allMatches.map((user) => {
      const otherPrefs = user.preferences || {};
      let matchScore = 0;

      // 1. Belief match (+1)
      if (otherPrefs.belief && otherPrefs.belief === userPrefs.belief) matchScore += 1;
      
      // 2. Vibe match (+1)
      if (otherPrefs.vibe && otherPrefs.vibe === userPrefs.vibe) matchScore += 1;
      
      // 3. Intent match (+1)
      if (otherPrefs.intent && otherPrefs.intent === userPrefs.intent) matchScore += 1;
      
      // 4. Age Range match (+1)
      if (otherPrefs.ageRange && otherPrefs.ageRange === userPrefs.ageRange) matchScore += 1;

      // 5. Common Interests match (+2 per common interest)
      const otherInterests = otherPrefs.interests || [];
      const commonInterests = otherInterests.filter(interest => userInterests.includes(interest));
      if (commonInterests.length > 0) matchScore += (commonInterests.length * 2);

      return { 
        ...user._doc, 
        matchScore: matchScore 
      };
    });

    // Sort by Highest Score
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    // Top 20 Results
    const finalMatches = scoredMatches.slice(0, 20);

    console.log("Total users returned after algorithm:", finalMatches.length);

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


exports.updatePreferences = async (req, res) => {
  try {
    const { belief, vibe, intent, ageRange, interests } = req.body;

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
      { new: true }
    ).select('-password');

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

// ✅ Naya API: Frontend ko saare options (emojis ke saath) bhejne ke liye
exports.getOptions = async (req, res) => {
  try {
    const options = {
      beliefs: ['✨ Spiritual', '🌌 Agnostic', '🔮 Atheist', '👑 Traditional'],
      vibes: ['🌙 Late-night Talks', '☕ Coffee & Books', '🎨 Elite Art & Poetry', '🚀 Tech & Philosophy'],
      intents: ['💬 Deep Midnight Chat', '🌍 Global Friendship', '🎭 Secret Confessions', '🧠 Philosophical Debates'],
      ageRanges: ['18 - 24 yrs', '25 - 32 yrs', '33 - 40 yrs', '40+ yrs (Elite)']
    };

    res.status(200).json({ 
      message: "Options fetched successfully", 
      data: options 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch options" });
  }
};