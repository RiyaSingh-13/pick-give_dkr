// backend/server.js - Reloading nodemon config
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Import API Routers
const userRoutes = require('./routes/userRoutes');
const donationRoutes = require('./routes/donationRoutes');
const requestRoutes = require('./routes/requestRoutes');
const auditRoutes = require('./routes/auditRoutes');

// Map API Endpoints
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/audits', auditRoutes);

// Basic API Ping Status Endpoint
app.get('/api/ping', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Pick&Give MERN Backend is running successfully!',
    timestamp: new Date()
  });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;
const seedDatabase = require('./seed');

global.isDbConnected = false;

if (!MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI is not defined in the environment configuration.');
  console.log('⚠️ Falling back to clean in-memory database mode for seamless offline testing.');
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Successfully connected to MongoDB Atlas database.');
      global.isDbConnected = true;
      
      // Migration: Ensure all existing users are verified
      const User = require('./models/User');
      User.updateMany({ isVerified: { $exists: false } }, { $set: { isVerified: true } })
        .then(res => {
          if (res.modifiedCount > 0) {
            console.log(`🧹 Migration: Verified ${res.modifiedCount} existing accounts.`);
          }
        })
        .catch(err => console.error('❌ Migration error:', err));

      // Run the automatic data seed
      seedDatabase();
    })
    .catch((err) => {
      console.error('❌ MongoDB database connection error:', err.message);
      console.log('⚠️ Falling back to clean in-memory database mode for seamless offline testing.');
      global.isDbConnected = false;
    });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Pick&Give server is listening on port ${PORT}`);
});
