const express = require('express');
const router = express.Router();
const { getAllPlans, addPlan } = require('../controllers/planController');

router.get('/all', getAllPlans);
router.post('/add', addPlan);

module.exports = router;