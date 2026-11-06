const Like = require('../models/Like');
const User = require('../models/User');

exports.sendLike = async (req, res) => {
  const { receiverId, type } = req.body;
  const senderId = req.user.id;

  try {
    if (senderId === receiverId) {
      return res.status(400).json({ error: "You cannot like yourself" });
    }

    const existingLike = await Like.findOne({ senderId, receiverId });
    if (existingLike) {
      return res.status(400).json({ error: "You already liked this user" });
    }

    const like = new Like({ 
      senderId, 
      receiverId, 
      type: type || 'like' 
    });
    await like.save();

    const mutualLike = await Like.findOne({ 
      senderId: receiverId, 
      receiverId: senderId 
    });

    res.status(201).json({
      message: "Like sent successfully",
      isMatch: !!mutualLike,
      like
    });
  } catch (error) {
    console.error("Send Like Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getWhoLikedMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const likes = await Like.find({ receiverId: userId })
      .populate('senderId', 'name age gender profilePic bio city')
      .sort({ createdAt: -1 });

    const currentUser = await User.findById(userId).select('isPremium');

    const result = likes.map(like => {
      const sender = like.senderId;
      
      if (!currentUser.isPremium) {
        return {
          _id: like._id,
          isBlurred: true,
          sender: {
            name: sender.name,
            profilePic: sender.profilePic,
          }
        };
      }

      return {
        _id: like._id,
        isBlurred: false,
        sender: {
          _id: sender._id,
          name: sender.name,
          age: sender.age,
          gender: sender.gender,
          bio: sender.bio,
          city: sender.city,
          profilePic: sender.profilePic
        }
      };
    });

    res.status(200).json({
      totalLikes: likes.length,
      isPremium: currentUser.isPremium,
      likes: result
    });
  } catch (error) {
    console.error("Get Who Liked Me Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getMyLikes = async (req, res) => {
  const userId = req.user.id;

  try {
    const likes = await Like.find({ senderId: userId })
      .populate('receiverId', 'name age gender profilePic bio city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalLikes: likes.length,
      likes: likes.map(like => ({
        _id: like._id,
        type: like.type,
        createdAt: like.createdAt,
        receiver: like.receiverId
      }))
    });
  } catch (error) {
    console.error("Get My Likes Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getMatches = async (req, res) => {
  const userId = req.user.id;

  try {
    const myLikes = await Like.find({ senderId: userId }).select('receiverId');
    const myLikeIds = myLikes.map(l => l.receiverId.toString());

    const theirLikes = await Like.find({ 
      receiverId: userId,
      senderId: { $in: myLikeIds }
    }).populate('senderId', 'name age gender profilePic bio city');

    res.status(200).json({
      totalMatches: theirLikes.length,
      matches: theirLikes.map(like => like.senderId)
    });
  } catch (error) {
    console.error("Get Matches Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.unlike = async (req, res) => {
  const { likeId } = req.params;
  const userId = req.user.id;

  try {
    const like = await Like.findOne({ _id: likeId, senderId: userId });
    if (!like) {
      return res.status(404).json({ error: "Like not found" });
    }

    await Like.deleteOne({ _id: likeId });
    res.status(200).json({ message: "Like removed" });
  } catch (error) {
    console.error("Unlike Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};