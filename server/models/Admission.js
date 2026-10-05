const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
    trim: true
  },
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
    trim: true
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Student Aadhaar number is required'],
    trim: true,
    match: [/^\d{12}$/, 'Please provide a valid 12-digit Student Aadhaar number']
  },
  parentAadhaarNumber: {
    type: String,
    trim: true,
    match: [/^\d{12}$/, 'Please provide a valid 12-digit Parent Aadhaar number']
  },
  parentPhone: {
    type: String,
    required: [true, 'Parent/guardian phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
  },
  parentEmail: {
    type: String,
    required: [true, 'Parent email address is required'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  studentPhone: {
    type: String,
    required: [true, 'Student phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
  },
  studentEmail: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  previousStream: {
    type: String,
    required: [true, 'Previous stream is required'],
    enum: ['Science', 'Commerce', 'Arts']
  },
  previousCollege: {
    type: String,
    required: [true, 'Previous college name is required'],
    trim: true
  },
  pucBoard: {
    type: String,
    enum: ['State', 'CBSE'],
    default: 'State'
  },
  pucMarks: {
    type: Number,
    required: function() { return this.pucBoard === 'State'; },
    min: [0, 'Marks cannot be negative'],
    max: [600, 'Marks cannot exceed maximum limits'] // Standard max marks in Karnataka PUC is 600
  },
  pucCgpa: {
    type: Number,
    required: function() { return this.pucBoard === 'CBSE'; },
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10']
  },
  pucPercentage: {
    type: Number,
    required: [true, 'PUC Percentage is required'],
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  sslcBoard: {
    type: String,
    enum: ['State', 'CBSE'],
    default: 'State'
  },
  sslcMarks: {
    type: Number,
    required: function() { return this.sslcBoard === 'State'; },
    min: [0, 'Marks cannot be negative'],
    max: [625, 'Marks cannot exceed maximum limits'] // Standard max marks in Karnataka SSLC is 625
  },
  sslcCgpa: {
    type: Number,
    required: function() { return this.sslcBoard === 'CBSE'; },
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10']
  },
  sslcPercentage: {
    type: Number,
    required: [true, 'SSLC Percentage is required'],
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
    trim: true
  },
  documents: {
    aadhaarCard: { type: String, required: [true, 'Student Aadhaar Card upload is required'] },
    panCard: { type: String, default: '' },
    incomeCaste: { type: String, required: [true, 'Income/Caste Certificate upload is required'] },
    fatherAadhaar: { type: String, required: [true, 'Father Aadhaar Card upload is required'] },
    motherAadhaar: { type: String, required: [true, 'Mother Aadhaar Card upload is required'] },
    pucMarksCard: { type: String, required: [true, 'PUC II Marks Card upload is required'] },
    sslcMarksCard: { type: String, required: [true, 'SSLC Marks Card upload is required'] },
    studentSignature: { type: String, required: [true, 'Student Signature upload is required'] }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  uucmsNo: {
    type: String,
    trim: true,
    default: ''
  },
  rollNo: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admission', AdmissionSchema);
