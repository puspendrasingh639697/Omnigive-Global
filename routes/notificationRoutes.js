const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

// GET /api/notification — saari notifications
router.get('/', auth, getNotifications);

// PUT /api/notification/:notificationId/read — ek ko read mark
router.put('/:notificationId/read', auth, markAsRead);

// PUT /api/notification/read-all — sabko read mark
router.put('/read-all', auth, markAllAsRead);

// DELETE /api/notification/:notificationId — delete
router.delete('/:notificationId', auth, deleteNotification);

module.exports = router;