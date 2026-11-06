const User = require('../models/User');

exports.getDiscoveries = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    let matchQuery = { _id: { $ne: currentUserId } }; 
    if (currentUser.lookingFor === 'Male') matchQuery.gender = 'Male';
    else if (currentUser.lookingFor === 'Female') matchQuery.gender = 'Female';

    const matches = await User.find(matchQuery).select('-password').limit(20); 
    res.status(200).json({ message: "Discoveries fetched", count: matches.length, users: matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};