const express = require('express');
const router = express.Router();
const { 
  sendProposal, 
  acceptProposal, 
  rejectProposal, 
  getMyProposals 
} = require('../controllers/proposalController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send', authMiddleware, sendProposal);
router.put('/accept/:proposalId', authMiddleware, acceptProposal);
router.put('/reject/:proposalId', authMiddleware, rejectProposal);
router.get('/my-proposals', authMiddleware, getMyProposals);

module.exports = router;