const mongoose = require('mongoose');

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, default: '' },
  uucmsNo: { type: String, default: '' },
  parentEmail: { type: String, required: true },
  subject: { type: String, required: true },
  totalClasses: { type: Number, default: 0 },
  classesPresent: { type: Number, default: 0 },
  percentage: { type: Number, default: 100 },
  status: { type: String, default: 'Eligible' },
  createdAt: { type: Date, default: Date.now }
});

// Behavior Schema
const BehaviorSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, default: '' },
  uucmsNo: { type: String, default: '' },
  parentEmail: { type: String, required: true },
  rating: { 
    type: String, 
    enum: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Disruptive'], 
    required: true 
  },
  category: { type: String, default: 'Classroom Conduct' },
  remarks: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Complaint Schema
const ComplaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, default: '' },
  uucmsNo: { type: String, default: '' },
  parentEmail: { type: String, required: true },
  title: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  description: { type: String, required: true },
  actionTaken: { type: String, default: 'Parent Notification Sent' },
  createdAt: { type: Date, default: Date.now }
});

// Notice Schema (Events, Competitions like Hackathon, Gaming, Sports)
const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Hackathon', 'Gaming', 'Sports', 'Cultural', 'Academic', 'General'], 
    required: true 
  },
  targetStream: { type: String, default: 'All' },
  targetStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', default: null },
  targetStudentName: { type: String, default: 'All Students' },
  description: { type: String, required: true },
  eventDate: { type: String, required: true },
  venue: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Marks Schema (IA-1, IA-2, IA-3, Sem End Exams)
const MarksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, default: '' },
  uucmsNo: { type: String, default: '' },
  parentEmail: { type: String, required: true },
  examType: { type: String, enum: ['IA-1', 'IA-2', 'IA-3', 'Sem End Exam'], required: true },
  semester: { type: String, required: true },
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['Pass', 'Fail'], required: true },
  remarks: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Attendance: mongoose.model('Attendance', AttendanceSchema),
  Behavior: mongoose.model('Behavior', BehaviorSchema),
  Complaint: mongoose.model('Complaint', ComplaintSchema),
  Notice: mongoose.model('Notice', NoticeSchema),
  Marks: mongoose.model('Marks', MarksSchema)
};
