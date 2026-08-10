const mongoose = require('mongoose');

const SmsLogSchema = new mongoose.Schema({
  recipientPhone: {
    type: String,
    required: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Approval', 'Rejection'],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SmsLog', SmsLogSchema);
