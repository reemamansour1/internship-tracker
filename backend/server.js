const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// ✅ Then serve the rest of the frontend statically
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
