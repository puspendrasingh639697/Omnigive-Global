// const admin = require('firebase-admin');
// const fs = require('fs');
// const path = require('path');

// let serviceAccount;

// // ✅ Check karein: Agar Render par hain (env variable available hai)
// if (process.env.FIREBASE_SERVICE_ACCOUNT) {
//   serviceAccount = JSON.parse(
//     Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8')
//   );
//   console.log('🔵 Firebase initialized from Environment Variable (Render)');
// } 
// // ✅ Agar local computer par hain (JSON file available hai)
// else {
//   const filePath = path.join(__dirname, '../serviceAccountKey.json');
  
//   if (fs.existsSync(filePath)) {
//     serviceAccount = require('../serviceAccountKey.json');
//     console.log('🟢 Firebase initialized from JSON file (Local)');
//   } else {
//     console.error('❌ serviceAccountKey.json NOT FOUND!');
//     process.exit(1);
//   }
// }

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// console.log('✅ Firebase Admin Initialized');
// module.exports = admin;


const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount;

// ✅ 1. Check karein: Agar Render par hain (env variable available hai)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8')
    );
    console.log('🔵 Firebase initialized from Environment Variable (Render)');
  } catch (error) {
    console.error('❌ Firebase Env Variable Parse Error:', error);
  }
} 
// ✅ 2. Agar local computer par hain (JSON file available hai)
else {
  const filePath = path.join(__dirname, '../serviceAccountKey.json');
  
  if (fs.existsSync(filePath)) {
    serviceAccount = require('../serviceAccountKey.json');
    console.log('🟢 Firebase initialized from JSON file (Local)');
  } else {
    console.error('❌ serviceAccountKey.json NOT FOUND!');
    process.exit(1);
  }
}

// ✅ 3. Initialize only once (Error se bachne ke liye)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin Initialized');
}

module.exports = admin;