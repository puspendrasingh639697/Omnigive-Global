const Notification = require('../models/Notification');

// Saari notifications fetch karo
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'name profilePic')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch notifications" });
  }
};

// Ek notification ko read mark karo
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { notificationId } = req.params;

    const notif = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Marked as read", notification: notif });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to mark as read" });
  }
};

// Saari notifications read mark karo
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to mark all as read" });
  }
};

// Notification delete karo
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { notificationId } = req.params;

    const deleted = await Notification.findOneAndDelete({ 
      _id: notificationId, 
      recipient: userId 
    });

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete notification" });
  }
};