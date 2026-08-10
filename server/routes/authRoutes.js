const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');

// Middleware to verify database connectivity
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is currently offline. Please ensure MongoDB is running and configure MONGO_URI.'
    });
  }
  next();
};

// @route   POST /api/auth/register/parent
// @desc    Register a new parent account
// @access  Public
router.post('/register/parent', checkDbConnection, async (req, res) => {
  try {
    const { phone, studentAadhaar, password } = req.body;

    if (!phone || !studentAadhaar || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit phone number' });
    }

    if (!/^\d{12}$/.test(studentAadhaar)) {
      return res.status(400).json({ message: 'Please enter a valid 12-digit Aadhaar number' });
    }

    // Check if phone already registered for a parent
    const existingPhone = await User.findOne({ phone, role: 'Parent' });
    if (existingPhone) {
      return res.status(400).json({ message: 'A parent account with this phone number already exists' });
    }

    // Check if Aadhaar already mapped to a parent account
    const existingAadhaar = await User.findOne({ studentAadhaar });
    if (existingAadhaar) {
      return res.status(400).json({ message: 'This Student Aadhaar number is already linked to another parent account' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      role: 'Parent',
      phone,
      studentAadhaar,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: newUser._id,
        role: newUser.role,
        phone: newUser.phone,
        studentAadhaar: newUser.studentAadhaar
      }
    });
  } catch (error) {
    console.error('Parent registration error:', error);
    res.status(500).json({ message: 'Server error during parent registration' });
  }
});

// @route   POST /api/auth/register/teacher
// @desc    Register a new teacher account and generate a unique ID
// @access  Public
router.post('/register/teacher', checkDbConnection, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please enter a password' });
    }

    // Generate a unique Teacher ID (TCH-XXXXX)
    let teacherId = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 100) {
      const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 digits
      teacherId = `TCH-${randomDigits}`;
      const existingUser = await User.findOne({ teacherId });
      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Failed to generate a unique Teacher ID. Please try again.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      role: 'Teacher',
      teacherId,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: 'Teacher registration successful',
      teacherId: newUser.teacherId,
      user: {
        _id: newUser._id,
        role: newUser.role,
        teacherId: newUser.teacherId
      }
    });
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(500).json({ message: 'Server error during teacher registration' });
  }
});

// @route   POST /api/auth/login/parent
// @desc    Login for parents using phone & password
// @access  Public
router.post('/login/parent', checkDbConnection, async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ phone, role: 'Parent' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        role: user.role,
        phone: user.phone,
        studentAadhaar: user.studentAadhaar
      }
    });
  } catch (error) {
    console.error('Parent login error:', error);
    res.status(500).json({ message: 'Server error during parent login' });
  }
});

// @route   POST /api/auth/login/teacher
// @desc    Login for teachers using teacherId & password
// @access  Public
router.post('/login/teacher', checkDbConnection, async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ teacherId, role: 'Teacher' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Teacher ID or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Teacher ID or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        role: user.role,
        teacherId: user.teacherId
      }
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ message: 'Server error during teacher login' });
  }
});

module.exports = router;
