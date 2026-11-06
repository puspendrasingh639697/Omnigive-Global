const mongoose = require('mongoose');
require('dotenv').config();
const Gift = require('./models/Gift');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Gift.deleteMany({});
  console.log("🗑️  All Gifts Deleted!");
  process.exit(0);
}).catch(err => console.error(err));