const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/authMiddleware');

// POST /signup
router.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: 'Username already taken' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ name, username, password: hashed });
  await newUser.save();

  res.status(201).json({ message: 'User created' });
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// GET /me
router.get('/me', authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
