const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Document expires automatically after 5 minutes (TTL index)
  }
});

module.exports = mongoose.model('Otp', OtpSchema);
