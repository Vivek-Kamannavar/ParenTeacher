const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  recipientEmail: {
    type: String,
    required: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Approval', 'Rejection', 'Submission'],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailLog', EmailLogSchema);
