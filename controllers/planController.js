const Plan = require('../models/Plan');

// Saare plans fetch karein
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Naya plan add karein (Admin)
exports.addPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};