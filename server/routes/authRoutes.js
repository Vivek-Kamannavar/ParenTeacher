const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendEmail } = require('../services/emailService');
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

// Helper for password strength validation
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z)';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z)';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one digit (0-9)';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return 'Password must contain at least one special character (e.g. !@#$%^&*)';
  }
  return null;
};

// @route   POST /api/auth/register/parent
// @desc    Register a new parent account with separate parent and student contact fields
// @access  Public
router.post('/register/parent', checkDbConnection, async (req, res) => {
  try {
    const {
      phone,
      parentPhone,
      parentEmail,
      studentEmail,
      studentPhone,
      parentAadhaar,
      studentAadhaar,
      password
    } = req.body;

    const phoneToUse = (parentPhone || phone || '').trim();
    const aadhaarToUse = (parentAadhaar || studentAadhaar || '').trim();

    if (!phoneToUse || !parentEmail || !aadhaarToUse || !password) {
      return res.status(400).json({ message: 'Please enter all required fields (Parent Phone, Parent Email, Parent Aadhaar, and Password)' });
    }

    if (!/^\d{10}$/.test(phoneToUse)) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit parent phone number' });
    }

    if (!/^\S+@\S+\.\S+$/.test(parentEmail)) {
      return res.status(400).json({ message: 'Please enter a valid parent email address' });
    }

    if (!/^\d{12}$/.test(aadhaarToUse)) {
      return res.status(400).json({ message: 'Please enter a valid 12-digit Parent Aadhaar number' });
    }

    const passError = validatePassword(password);
    if (passError) {
      return res.status(400).json({ message: passError });
    }

    // Check if phone or email already registered for a parent
    const existingUser = await User.findOne({
      role: 'Parent',
      $or: [{ phone: phoneToUse }, { parentEmail: parentEmail.toLowerCase().trim() }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'A parent account with this phone number or email address already exists' });
    }

    // Check if Aadhaar already mapped
    const existingAadhaar = await User.findOne({
      $or: [{ parentAadhaar: aadhaarToUse }, { studentAadhaar: aadhaarToUse }]
    });
    if (existingAadhaar) {
      return res.status(400).json({ message: 'This Parent Aadhaar number is already linked to another parent account' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      role: 'Parent',
      phone: phoneToUse,
      parentEmail: parentEmail.toLowerCase().trim(),
      studentEmail: studentEmail ? studentEmail.toLowerCase().trim() : '',
      studentPhone: studentPhone ? studentPhone.trim() : '',
      parentAadhaar: aadhaarToUse,
      studentAadhaar: aadhaarToUse,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: newUser._id,
        role: newUser.role,
        phone: newUser.phone,
        parentPhone: newUser.phone,
        parentEmail: newUser.parentEmail,
        studentEmail: newUser.studentEmail,
        studentPhone: newUser.studentPhone,
        parentAadhaar: newUser.parentAadhaar,
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

    const passError = validatePassword(password);
    if (passError) {
      return res.status(400).json({ message: passError });
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

    const user = await User.findOne({
      role: 'Parent',
      $or: [{ phone: phone.trim() }, { parentEmail: phone.toLowerCase().trim() }]
    });

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
        parentPhone: user.phone,
        parentEmail: user.parentEmail,
        studentEmail: user.studentEmail,
        studentPhone: user.studentPhone,
        parentAadhaar: user.parentAadhaar || user.studentAadhaar,
        studentAadhaar: user.studentAadhaar || user.parentAadhaar
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

// @route   POST /api/auth/forgot-password/request-otp
// @desc    Generate a 6-digit OTP and email it to Parent's registered email
// @access  Public
router.post('/forgot-password/request-otp', checkDbConnection, async (req, res) => {
  try {
    const { parentPhone, parentEmail, inputKey } = req.body;
    const searchVal = (parentEmail || parentPhone || inputKey || '').trim();

    if (!searchVal) {
      return res.status(400).json({ message: 'Please enter registered Parent Phone Number or Parent Email' });
    }

    const user = await User.findOne({
      role: 'Parent',
      $or: [
        { parentEmail: searchVal.toLowerCase() },
        { phone: searchVal }
      ]
    });

    if (!user || !user.parentEmail) {
      return res.status(404).json({ message: 'No registered parent account found with this email or phone number' });
    }

    // Generate 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear old OTPs for this user
    await Otp.deleteMany({
      $or: [{ email: user.parentEmail }, { phone: user.phone }]
    });

    // Save new OTP with 5 min TTL
    const newOtpDoc = new Otp({
      email: user.parentEmail,
      phone: user.phone,
      otp: generatedOtp
    });
    await newOtpDoc.save();

    // Dispatch Email with OTP
    const subject = `Your Password Reset Verification OTP - KLE Jabin College`;
    const body = `Dear Parent,

We received a request to reset the password for your Parents Portal account (Phone: ${user.phone}).

Your 6-Digit Email Verification OTP is: ${generatedOtp}

This OTP is valid for 5 minutes. Please enter this code on the screen to reset your password.

Warm regards,
Admissions Desk
KLE's BCA P. C. Jabin Science College Hubballi`;

    const emailResult = await sendEmail(user.parentEmail, subject, body);

    const maskedEmail = user.parentEmail.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + '*'.repeat(gp3.length));

    console.log(`🔑 Generated Forgot Password OTP [${generatedOtp}] for Parent (${user.parentEmail})`);

    res.json({
      message: `Verification OTP dispatched to parent email: ${maskedEmail}`,
      parentEmail: user.parentEmail,
      parentPhone: user.phone,
      simulationOtp: emailResult.mode === 'simulation' ? generatedOtp : undefined
    });
  } catch (error) {
    console.error('Error generating forgot-password OTP:', error);
    res.status(500).json({ message: 'Server error generating OTP' });
  }
});

// @route   POST /api/auth/forgot-password/verify-otp-only
// @desc    Verify 6-digit Email OTP without updating password yet
// @access  Public
router.post('/forgot-password/verify-otp-only', checkDbConnection, async (req, res) => {
  try {
    const { parentEmail, parentPhone, otp } = req.body;

    if ((!parentEmail && !parentPhone) || !otp) {
      return res.status(400).json({ message: 'Please enter the 6-digit verification OTP' });
    }

    const user = await User.findOne({
      role: 'Parent',
      $or: [
        { parentEmail: (parentEmail || '').toLowerCase().trim() },
        { phone: (parentPhone || '').trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'No registered parent account found' });
    }

    // Verify OTP record
    const otpDoc = await Otp.findOne({
      $or: [{ email: user.parentEmail }, { phone: user.phone }],
      otp: otp.trim()
    });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired 6-digit OTP. Please check and try again.' });
    }

    res.json({ message: 'OTP verified successfully!', verified: true });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// @route   POST /api/auth/forgot-password/verify-otp
// @desc    Verify 6-digit Email OTP and set new password
// @access  Public
router.post('/forgot-password/verify-otp', checkDbConnection, async (req, res) => {
  try {
    const { parentEmail, parentPhone, otp, newPassword } = req.body;

    if ((!parentEmail && !parentPhone) || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const passError = validatePassword(newPassword);
    if (passError) {
      return res.status(400).json({ message: passError });
    }

    const user = await User.findOne({
      role: 'Parent',
      $or: [
        { parentEmail: (parentEmail || '').toLowerCase().trim() },
        { phone: (parentPhone || '').trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'No registered parent account found' });
    }

    // Verify OTP record
    const otpDoc = await Otp.findOne({
      $or: [{ email: user.parentEmail }, { phone: user.phone }],
      otp: otp.trim()
    });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired 6-digit OTP. Please click Resend OTP.' });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteMany({
      $or: [{ email: user.parentEmail }, { phone: user.phone }]
    });

    res.json({ message: 'Password reset successful! Please log in with your new password.' });
  } catch (error) {
    console.error('Error verifying OTP and resetting password:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// @route   POST /api/auth/forgot-password/teacher
// @desc    Reset teacher password if teacherId & college verification match
// @access  Public
router.post('/forgot-password/teacher', checkDbConnection, async (req, res) => {
  try {
    const { teacherId, securityQuestionAnswer, newPassword } = req.body;

    if (!teacherId || !securityQuestionAnswer || !newPassword) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const passError = validatePassword(newPassword);
    if (passError) {
      return res.status(400).json({ message: passError });
    }

    // Verify security answer (college name: Jabin / P. C. Jabin / P C Jabin / KLE's Jabin)
    const cleanAnswer = securityQuestionAnswer.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanAnswer.includes('jabin')) {
      return res.status(400).json({ message: 'Incorrect security verification answer' });
    }

    // Find teacher user
    const user = await User.findOne({ teacherId, role: 'Teacher' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Teachers/Principal ID' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (error) {
    console.error('Teacher password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;
