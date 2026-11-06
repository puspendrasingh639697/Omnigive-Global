const admin = require('firebase-admin');
// Yahan ek dot (.) lagayein, do dot (..) nahi
const serviceAccount = require('./serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});