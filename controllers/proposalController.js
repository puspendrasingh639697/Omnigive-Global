const Proposal = require('../models/Proposal');
const User = require('../models/User');

// ✅ 1. Proposal Bhejein
exports.sendProposal = async (req, res) => {
  const { receiverId, ringType } = req.body;
  const senderId = req.user.id;

  try {
    if (senderId === receiverId) {
      return res.status(400).json({ error: "You cannot propose to yourself" });
    }

    // Check if already proposed
    const existing = await Proposal.findOne({ senderId, receiverId });
    if (existing) {
      return res.status(400).json({ error: "Proposal already sent" });
    }

    const proposal = new Proposal({
      senderId,
      receiverId,
      ringType: ringType || "Gold Ring",
      loveProgress: 10 // 10% se shuru
    });
    await proposal.save();

    // Real-time notification (Socket.IO se)
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit("newProposal", {
        proposalId: proposal._id,
        senderName: (await User.findById(senderId)).name,
        ringType: proposal.ringType
      });
    }

    res.status(201).json({ 
      message: "Proposal sent successfully!",
      proposal 
    });
  } catch (error) {
    console.error("Send Proposal Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ 2. Proposal Accept Karein
exports.acceptProposal = async (req, res) => {
  const { proposalId } = req.params;
  const userId = req.user.id;

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    if (proposal.receiverId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    proposal.status = 'accepted';
    proposal.loveProgress = 100; // 100% ho gaya
    await proposal.save();

    // Real-time notification to sender
    const io = req.app.get('io');
    if (io) {
      io.to(proposal.senderId.toString()).emit("proposalAccepted", {
        proposalId: proposal._id,
        message: "Your proposal was accepted! 💖"
      });
    }

    res.status(200).json({ 
      message: "Proposal accepted!",
      proposal 
    });
  } catch (error) {
    console.error("Accept Proposal Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ 3. Proposal Reject Karein
exports.rejectProposal = async (req, res) => {
  const { proposalId } = req.params;
  const userId = req.user.id;

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    if (proposal.receiverId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    proposal.status = 'rejected';
    await proposal.save();

    res.status(200).json({ 
      message: "Proposal rejected",
      proposal 
    });
  } catch (error) {
    console.error("Reject Proposal Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ 4. Apne Proposals Dekhein
exports.getMyProposals = async (req, res) => {
  const userId = req.user.id;

  try {
    const sent = await Proposal.find({ senderId: userId })
      .populate('receiverId', 'name profilePic');
    
    const received = await Proposal.find({ receiverId: userId })
      .populate('senderId', 'name profilePic');

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error("Get Proposals Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};