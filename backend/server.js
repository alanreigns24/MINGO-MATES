const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// ----------------------------------------------------------------------
// IMPORTANT: To run this server, you need a Firebase Service Account Key.
// 1. Go to Firebase Console -> Project Settings -> Service Accounts
// 2. Click "Generate new private key"
// 3. Save the downloaded JSON file as `serviceAccountKey.json` in this `backend` folder.
// ----------------------------------------------------------------------

try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin initialized successfully.");
} catch (error) {
  console.warn("⚠️  WARNING: serviceAccountKey.json not found or invalid.");
  console.warn("⚠️  The server will start, but database calls will fail until you provide the key.");
  // admin.initializeApp(); // Fallback for some cloud environments, but local will fail without key
}

const db = admin.firestore ? admin.firestore() : null;

const app = express();
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send('Mingo Mates Backend is running!');
});

/**
 * POST /api/calculate-order
 * Securely calculates the total bill and commissions based on current database prices.
 * 
 * Body: {
 *   items: [ { id: 'burger', quantity: 2 }, { id: 'coke', quantity: 1 } ]
 * }
 */
app.post('/api/calculate-order', async (req, res) => {
  if (!db) {
    return res.status(500).json({ success: false, error: "Database not initialized. Missing service account key." });
  }

  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "Invalid items array provided." });
    }

    let totalBill = 0;
    let totalCommission = 0;

    // We process each item asynchronously. 
    // In a production app with huge menus, you might want to fetch the whole menu once 
    // or batch the get requests, but a loop is fine for small orders.
    for (const item of items) {
      const docSnap = await db.collection('menu').doc(item.id).get();
      
      if (!docSnap.exists) {
        console.warn(`Item ${item.id} not found in database.`);
        continue;
      }
      
      const data = docSnap.data();
      const qty = item.quantity;
      
      // Calculate item total using trusted DB price (ignoring frontend price)
      totalBill += (data.price * qty);
      
      // Calculate commission based on category rules
      if (data.category === 'food') {
        totalCommission += (20 * qty);
      } else if (data.category === 'drink' || data.category === 'ice_cream') {
        totalCommission += (10 * qty);
      }
    }

    res.json({ 
      success: true, 
      totalBill, 
      totalCommission 
    });

  } catch (error) {
    console.error("Error calculating order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
