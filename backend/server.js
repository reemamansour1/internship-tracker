// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes - this makes your routes accessible at /api/applications
app.use('/api/applications', applicationRoutes);

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));
console.log('Static files served from:', path.join(__dirname, '../frontend'));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// MongoDB Connection - SINGLE FUNCTION ONLY
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    // Remove quotes - use the actual environment variable
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('Make sure your .env file has the correct MONGODB_URI');
    // Don't exit - let server run even if DB is down for testing
  }
};

// Connect to database
connectDB();

// Import and use routes (only if files exist)
try {
  const applicationRoutes = require('./routes/applications');
  app.use('/api/applications', applicationRoutes);
  console.log('✅ Application routes loaded');
} catch (error) {
  console.error('❌ Could not load application routes:', error.message);
  console.log('Make sure ./routes/applications.js exists');
}

// Serve frontend pages
app.get('/', (req, res) => {
  console.log('Serving home page');
  res.sendFile(path.join(__dirname, '../frontend', 'home.html'));
});

app.get('/applications', (req, res) => {
  console.log('Serving applications page');
  res.sendFile(path.join(__dirname, '../frontend', 'application.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Handle 404 - Page not found
app.use((req, res) => {
  console.log('404 - Route not found:', req.url);
  res.status(404).json({ message: 'Route not found: ' + req.url });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving frontend from: ${path.join(__dirname, '../frontend')}`);
  console.log(`🔗 Test the server at: http://localhost:${PORT}/test`);
});