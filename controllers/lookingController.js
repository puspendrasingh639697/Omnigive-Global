const User = require('../models/User');

exports.getDiscoveries = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // 🔍 Check 1: User kis gender ko dhoondh raha hai?
    console.log("Current User Looking For:", currentUser.lookingFor);

    let matchQuery = { _id: { $ne: currentUserId } }; 
    if (currentUser.lookingFor === 'Male') matchQuery.gender = 'Male';
    else if (currentUser.lookingFor === 'Female') matchQuery.gender = 'Female';

    // 🔍 Check 2: Gender filter se kitne users mil rahe hain?
    const allMatches = await User.find(matchQuery).select('-password').limit(50); 
    console.log("Total users found by Gender filter:", allMatches.length);

    // Agar database me users hi nahi hain, toh yahin se return kar jao
    if (allMatches.length === 0) {
      return res.status(200).json({ 
        message: "No users found for your gender preference. Invite more users!", 
        count: 0, 
        users: [] 
      });
    }

    const userPrefs = currentUser.preferences || {};
    const userInterests = userPrefs.interests || [];

    // 🔍 Check 3: Matching Algorithm (Score ke hisaab se)
    let scoredMatches = allMatches.map((user) => {
      const otherPrefs = user.preferences || {};
      let matchScore = 0;

      // Belief match (+1)
      if (otherPrefs.belief && otherPrefs.belief === userPrefs.belief) matchScore += 1;
      
      // Vibe match (+1)
      if (otherPrefs.vibe && otherPrefs.vibe === userPrefs.vibe) matchScore += 1;
      
      // Intent match (+1)
      if (otherPrefs.intent && otherPrefs.intent === userPrefs.intent) matchScore += 1;
      
      // Age Range match (+1)
      if (otherPrefs.ageRange && otherPrefs.ageRange === userPrefs.ageRange) matchScore += 1;

      // Common Interests match (+2)
      const otherInterests = otherPrefs.interests || [];
      const commonInterests = otherInterests.filter(interest => userInterests.includes(interest));
      if (commonInterests.length > 0) matchScore += 2;

      return { 
        ...user._doc, 
        matchScore: matchScore 
      };
    });

    // 🔍 Check 4: Score ke hisaab se sort karo
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    // ⚠️ IMPORTANT: Agar aap chahte ho ki 0 score wale users bhi dikhein (taaki screen khali na lage), 
    // toh neeche wali line ko comment (//) kar do. Abhi ke liye maine isko hata diya hai taaki saare users dikhein.
    // scoredMatches = scoredMatches.filter(user => user.matchScore > 0);

    // Top 20 results return karo
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