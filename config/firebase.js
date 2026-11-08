// const admin = require('firebase-admin');
// const serviceAccount = require('../serviceAccountKey.json'); // ✅ Yahi sahi hai

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// console.log('✅ Firebase Admin Initialized');
// module.exports = admin;


const admin = require('firebase-admin');

// ✅ Base64 se JSON decode karein (Render ke liye)
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('✅ Firebase Admin Initialized');
module.exports = admin;