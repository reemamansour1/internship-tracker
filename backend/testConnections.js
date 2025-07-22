const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
