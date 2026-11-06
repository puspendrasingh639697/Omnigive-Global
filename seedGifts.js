const mongoose = require('mongoose');
const Gift = require('./models/Gift');
require('dotenv').config();

const gifts = [
  // ============ 🌹 BASIC GIFTS (10-50 coins) ============
  { name: "Red Rose", price: 10, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/1208/1208033.png" },
  { name: "Pink Heart", price: 20, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png" },
  { name: "Coffee Cup", price: 30, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },
  { name: "Teddy Bear", price: 50, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/170/170323.png" },
  { name: "Chocolate Bar", price: 40, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Balloon", price: 15, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/1164/1164010.png" },
  { name: "Ice Cream", price: 25, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/938/938063.png" },
  { name: "Pizza Slice", price: 35, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png" },
  { name: "Star", price: 20, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Butterfly", price: 45, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/616/616430.png" },
  { name: "Sunflower", price: 25, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/1208/1208033.png" },
  { name: "Tulip", price: 20, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/1208/1208033.png" },
  { name: "Cherry", price: 15, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Donut", price: 30, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Lollipop", price: 18, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Cupcake", price: 45, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Cookie", price: 12, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Candy", price: 10, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Daisy", price: 22, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/1208/1208033.png" },
  { name: "Green Leaf", price: 8, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/616/616430.png" },

  // ============ 💎 PREMIUM GIFTS (100-500 coins) ============
  { name: "Diamond Ring", price: 500, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Champagne Bottle", price: 200, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },
  { name: "Rose Bouquet", price: 300, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/1208/1208033.png" },
  { name: "Gold Watch", price: 400, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942792.png" },
  { name: "Perfume Bottle", price: 150, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Gold Necklace", price: 350, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Sunglasses", price: 100, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972097.png" },
  { name: "Leather Handbag", price: 250, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "High Heels", price: 180, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2674/2674333.png" },
  { name: "Lipstick", price: 120, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Gold Bracelet", price: 280, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Diamond Earrings", price: 220, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Tiara", price: 450, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2798/2798072.png" },
  { name: "Silk Scarf", price: 160, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "Leather Jacket", price: 380, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2674/2674333.png" },
  { name: "Designer Hat", price: 140, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972097.png" },
  { name: "Gold Chain", price: 320, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942792.png" },
  { name: "Pearl Set", price: 480, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Leather Wallet", price: 180, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "Silk Tie", price: 130, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2674/2674333.png" },

  // ============ 👑 LUXURY GIFTS (1000-30000 coins) ============
  { name: "Golden Crown", price: 1000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/2798/2798072.png" },
  { name: "Sports Car", price: 5000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "Private Jet", price: 10000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/1140/1140802.png" },
  { name: "Luxury Yacht", price: 8000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/1048/1048314.png" },
  { name: "Mansion", price: 15000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/139/139078.png" },
  { name: "Diamond Gem", price: 2000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Gold Bar", price: 3000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942792.png" },
  { name: "Helicopter", price: 6000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "Private Island", price: 20000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/1048/1048314.png" },
  { name: "Royal Castle", price: 25000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/139/139078.png" },
  { name: "Rolex Watch", price: 4500, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942792.png" },
  { name: "Diamond Necklace", price: 7000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Ferrari", price: 12000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "Penthouse", price: 18000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/139/139078.png" },
  { name: "Gold Statue", price: 9000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/2798/2798072.png" },
  { name: "Diamond Crown", price: 22000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/2798/2798072.png" },
  { name: "Space Trip", price: 30000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/1140/1140802.png" },
  { name: "Gold Jet", price: 16000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/1140/1140802.png" },
  { name: "Diamond Car", price: 14000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "Royal Palace", price: 28000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/139/139078.png" },

  // ============ 🎉 SPECIAL / FESTIVAL GIFTS (50-500 coins) ============
  { name: "Diwali Diya", price: 100, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Christmas Tree", price: 150, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/1164/1164010.png" },
  { name: "Birthday Cake", price: 80, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Valentine Heart", price: 200, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png" },
  { name: "New Year Fireworks", price: 250, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },
  { name: "Wedding Ring", price: 400, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Love Letter", price: 60, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/1208/1208033.png" },
  { name: "Cupid Arrow", price: 120, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png" },
  { name: "Rose Garden", price: 350, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/1208/1208033.png" },
  { name: "Eid Moon", price: 180, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Holi Colors", price: 140, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/1164/1164010.png" },
  { name: "Rakhi", price: 90, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Ganesh Idol", price: 220, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/2798/2798072.png" },
  { name: "Lakshmi Idol", price: 260, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/2798/2798072.png" },
  { name: "Santa Claus", price: 170, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/1164/1164010.png" },
  { name: "Easter Egg", price: 110, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Halloween Pumpkin", price: 130, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },
  { name: "Thanksgiving Turkey", price: 160, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },
  { name: "Anniversary Cake", price: 240, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Candle Light Dinner", price: 500, category: "Special", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },

  // ============ 😂 FUN / EMOJI GIFTS (10-100 coins) ============
  { name: "Smiley Face", price: 10, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Laughing Emoji", price: 20, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Kiss Emoji", price: 30, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png" },
  { name: "Wink Emoji", price: 15, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Love Eyes Emoji", price: 40, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png" },
  { name: "Thumbs Up", price: 25, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Party Popper", price: 50, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1164/1164010.png" },
  { name: "Clapping Hands", price: 20, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Fire Emoji", price: 60, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },
  { name: "Rainbow", price: 45, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1164/1164010.png" },
  { name: "Cool Face", price: 35, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Crying Emoji", price: 28, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Angry Emoji", price: 22, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Surprised Emoji", price: 32, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Sleeping Emoji", price: 18, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Wink Face", price: 26, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Rocket Emoji", price: 70, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "Trophy", price: 80, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/2798/2798072.png" },
  { name: "Diamond Emoji", price: 90, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942855.png" },
  { name: "Bomb Emoji", price: 65, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/3126/3126610.png" },

  // ============ 🎮 EXTRA GIFTS (Mix) ============
  { name: "Guitar", price: 200, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Gaming Console", price: 800, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "DSLR Camera", price: 350, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972097.png" },
  { name: "Book", price: 60, category: "Basic", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "Music Note", price: 40, category: "Fun", imageUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
  { name: "Bicycle", price: 500, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "Motorcycle", price: 2000, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3209/3209040.png" },
  { name: "Grand Piano", price: 1500, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Painting", price: 250, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "World Globe", price: 180, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/139/139078.png" },
  { name: "Microphone", price: 300, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014518.png" },
  { name: "Headphones", price: 400, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "iPhone", price: 700, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "MacBook", price: 1200, category: "Luxury", imageUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050234.png" },
  { name: "Gold Watch", price: 600, category: "Premium", imageUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942792.png" },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("🔗 Connected to MongoDB");
  
  // Purane gifts delete karein
  await Gift.deleteMany({});
  console.log("🗑️  Old gifts deleted");
  
  // Naye gifts insert karein
  const result = await Gift.insertMany(gifts);
  console.log(`✅ ${result.length} gifts added successfully!`);
  
  process.exit(0);
}).catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});