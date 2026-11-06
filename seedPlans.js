const mongoose = require('mongoose');
const Plan = require('./models/Plan');
require('dotenv').config();

const plans = [
  // Gold Plans
  { name: "500 Gold Coins", description: "Small gold pack", price: 50, coins: 500, type: "Gold", popular: false },
  { name: "1000 Gold Coins", description: "Popular pack", price: 100, coins: 1000, type: "Gold", popular: true },
  { name: "5000 Gold Coins", description: "Best value", price: 400, coins: 5000, type: "Gold", popular: false },
  
  // Diamond Plans
  { name: "100 Diamonds", description: "Small diamond pack", price: 100, coins: 100, type: "Diamond", popular: false },
  { name: "500 Diamonds", description: "Popular pack", price: 400, coins: 500, type: "Diamond", popular: true },
  { name: "2000 Diamonds", description: "Best value", price: 1500, coins: 2000, type: "Diamond", popular: false },

  // Premium Plans
  { name: "Premium 1 Month", description: "Ad-free + unlimited gifts", price: 500, coins: 0, type: "Premium", popular: true },
  { name: "Premium 3 Months", description: "Save 20%", price: 1200, coins: 0, type: "Premium", popular: false },
  { name: "Premium 1 Year", description: "Save 40%", price: 4000, coins: 0, type: "Premium", popular: false },

  // Treasure
  { name: "Treasure Box", description: "Random rewards", price: 200, coins: 0, type: "Treasure", popular: false }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Plan.deleteMany({});
  await Plan.insertMany(plans);
  console.log(`✅ ${plans.length} plans added!`);
  process.exit(0);
});