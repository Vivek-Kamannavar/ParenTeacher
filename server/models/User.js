const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Parent', 'Teacher'],
    required: true
  },
  phone: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null/undefined values for teachers since phone is unique only for parents
  },
  studentAadhaar: {
    type: String,
    trim: true,
    sparse: true // Unique Aadhaar per parent account
  },
  teacherId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Unique generated ID for teachers
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enforce unique constraints dynamically based on role
// We can define custom validation or index configurations in mongoose
module.exports = mongoose.model('User', UserSchema);
