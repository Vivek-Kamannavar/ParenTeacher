const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Admission = require('../models/Admission');
const EmailLog = require('../models/EmailLog');
const { sendEmail } = require('../services/emailService');
const { Attendance, Behavior, Complaint, Notice, Marks } = require('../models/StudentRecord');

const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is currently offline. Please ensure MongoDB is running and configure MONGO_URI.'
    });
  }
  next();
};

// ==========================================
// 1. ATTENDANCE ENTRY (SUBJECT-BASED & AUTO-CALCULATED %)
// ==========================================
router.get('/attendance/subject/:subjectName', checkDbConnection, async (req, res) => {
  try {
    const subjectName = req.params.subjectName.trim();
    const records = await Attendance.find({ subject: new RegExp(`^${subjectName}$`, 'i') });
    res.json(records);
  } catch (error) {
    console.error('Error fetching subject attendance:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
});

router.post('/attendance', checkDbConnection, async (req, res) => {
  try {
    const { studentId, subject, totalClasses, classesPresent } = req.body;
    
    const admission = await Admission.findById(studentId);
    if (!admission) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const total = parseInt(totalClasses, 10) || 0;
    const present = parseInt(classesPresent, 10) || 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
    const status = percentage >= 75 ? 'Eligible' : 'Shortage';

    let attendanceRecord = await Attendance.findOne({ studentId: admission._id, subject });

    if (attendanceRecord) {
      attendanceRecord.totalClasses = total;
      attendanceRecord.classesPresent = present;
      attendanceRecord.percentage = percentage;
      attendanceRecord.status = status;
      attendanceRecord.studentName = admission.studentName;
      attendanceRecord.rollNo = admission.rollNo || 'N/A';
      attendanceRecord.uucmsNo = admission.uucmsNo || 'N/A';
      attendanceRecord.parentEmail = admission.parentEmail;
    } else {
      attendanceRecord = new Attendance({
        studentId: admission._id,
        studentName: admission.studentName,
        rollNo: admission.rollNo || 'N/A',
        uucmsNo: admission.uucmsNo || 'N/A',
        parentEmail: admission.parentEmail,
        subject,
        totalClasses: total,
        classesPresent: present,
        percentage,
        status
      });
    }

    const saved = await attendanceRecord.save();
    res.status(200).json(saved);
  } catch (error) {
    console.error('Error posting attendance:', error);
    res.status(500).json({ message: error.message || 'Server error recording attendance' });
  }
});

router.post('/attendance/bulk', checkDbConnection, async (req, res) => {
  try {
    const { subject, totalClasses, records } = req.body;
    if (!subject || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Subject and records array are required' });
    }

    const total = parseInt(totalClasses, 10) || 0;
    const updatedRecords = [];

    for (const item of records) {
      const admission = await Admission.findById(item.studentId);
      if (!admission) continue;

      const present = parseInt(item.classesPresent, 10) || 0;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
      const status = percentage >= 75 ? 'Eligible' : 'Shortage';

      let rec = await Attendance.findOne({ studentId: admission._id, subject });
      if (rec) {
        rec.totalClasses = total;
        rec.classesPresent = present;
        rec.percentage = percentage;
        rec.status = status;
        rec.studentName = admission.studentName;
        rec.rollNo = admission.rollNo || 'N/A';
        rec.uucmsNo = admission.uucmsNo || 'N/A';
        rec.parentEmail = admission.parentEmail;
      } else {
        rec = new Attendance({
          studentId: admission._id,
          studentName: admission.studentName,
          rollNo: admission.rollNo || 'N/A',
          uucmsNo: admission.uucmsNo || 'N/A',
          parentEmail: admission.parentEmail,
          subject,
          totalClasses: total,
          classesPresent: present,
          percentage,
          status
        });
      }

      const saved = await rec.save();
      updatedRecords.push(saved);
    }

    res.json({ message: `Successfully updated attendance for ${updatedRecords.length} students in ${subject}`, records: updatedRecords });
  } catch (error) {
    console.error('Error bulk updating attendance:', error);
    res.status(500).json({ message: error.message || 'Server error updating bulk attendance' });
  }
});

// ==========================================
// 2. BEHAVIOR & CONDUCT ENTRY
// ==========================================
router.post('/behavior', checkDbConnection, async (req, res) => {
  try {
    const { studentId, rating, category, remarks } = req.body;

    const admission = await Admission.findById(studentId);
    if (!admission) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const behaviorRecord = new Behavior({
      studentId: admission._id,
      studentName: admission.studentName,
      rollNo: admission.rollNo || 'N/A',
      uucmsNo: admission.uucmsNo || 'N/A',
      parentEmail: admission.parentEmail,
      rating,
      category: category || 'Classroom Conduct',
      remarks
    });

    const saved = await behaviorRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error posting behavior report:', error);
    res.status(500).json({ message: error.message || 'Server error recording behavior report' });
  }
});

// ==========================================
// 3. COMPLAINT ENTRY
// ==========================================
router.post('/complaint', checkDbConnection, async (req, res) => {
  try {
    const { studentId, title, severity, description, actionTaken } = req.body;

    const admission = await Admission.findById(studentId);
    if (!admission) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const complaintRecord = new Complaint({
      studentId: admission._id,
      studentName: admission.studentName,
      rollNo: admission.rollNo || 'N/A',
      uucmsNo: admission.uucmsNo || 'N/A',
      parentEmail: admission.parentEmail,
      title,
      severity: severity || 'Medium',
      description,
      actionTaken: actionTaken || 'Parent Notification Logged'
    });

    const saved = await complaintRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error posting complaint:', error);
    res.status(500).json({ message: error.message || 'Server error recording complaint' });
  }
});

// ==========================================
// 4. NOTICE / EVENT ENTRY (Hackathon, Gaming, Sports)
// ==========================================
router.post('/notice', checkDbConnection, async (req, res) => {
  try {
    const { title, category, targetStream, targetStudentId, description, eventDate, venue } = req.body;

    let targetStudentName = 'All Students';

    if (targetStudentId) {
      const admission = await Admission.findById(targetStudentId);
      if (admission) {
        targetStudentName = admission.studentName;
      }
    }

    const noticeRecord = new Notice({
      title,
      category,
      targetStream: targetStream || 'All',
      targetStudentId: targetStudentId || null,
      targetStudentName,
      description,
      eventDate,
      venue
    });

    const saved = await noticeRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error publishing notice:', error);
    res.status(500).json({ message: error.message || 'Server error publishing notice' });
  }
});

// ==========================================
// 5. MARKS ENTRY (IA-1, IA-2, Sem End)
// ==========================================
router.post('/marks', checkDbConnection, async (req, res) => {
  try {
    const { studentId, examType, semester, subject, marksObtained, maxMarks, remarks } = req.body;

    const admission = await Admission.findById(studentId);
    if (!admission) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const obtained = parseFloat(marksObtained);
    const max = parseFloat(maxMarks);
    if (isNaN(obtained) || isNaN(max) || max <= 0) {
      return res.status(400).json({ message: 'Valid marks obtained and maximum marks are required' });
    }

    const percentage = Math.round((obtained / max) * 100);
    const status = percentage >= 40 ? 'Pass' : 'Fail';

    const marksRecord = new Marks({
      studentId: admission._id,
      studentName: admission.studentName,
      rollNo: admission.rollNo || 'N/A',
      uucmsNo: admission.uucmsNo || 'N/A',
      parentEmail: admission.parentEmail,
      examType,
      semester,
      subject,
      marksObtained: obtained,
      maxMarks: max,
      percentage,
      status,
      remarks: remarks || ''
    });

    const saved = await marksRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error posting marks:', error);
    res.status(500).json({ message: error.message || 'Server error recording student marks' });
  }
});

// ==========================================
// 6. GET AGGREGATED STUDENT INFO (For Parents Portal)
// ==========================================
router.get('/student-info/:query', checkDbConnection, async (req, res) => {
  try {
    const queryStr = req.params.query.trim();

    // Find student by UUCMS, Roll No, Aadhaar, Parent Phone, Parent Email, Student Phone, Student Email, or ID
    let admission = null;
    if (mongoose.Types.ObjectId.isValid(queryStr)) {
      admission = await Admission.findById(queryStr);
    }

    if (!admission) {
      admission = await Admission.findOne({
        $or: [
          { uucmsNo: new RegExp(`^${queryStr}$`, 'i') },
          { rollNo: new RegExp(`^${queryStr}$`, 'i') },
          { aadhaarNumber: queryStr },
          { parentAadhaarNumber: queryStr },
          { parentPhone: queryStr },
          { parentEmail: new RegExp(`^${queryStr}$`, 'i') },
          { studentPhone: queryStr },
          { studentEmail: new RegExp(`^${queryStr}$`, 'i') },
          { studentName: new RegExp(queryStr, 'i') }
        ]
      });
    }

    if (!admission) {
      return res.status(404).json({ message: 'No student information found matching the criteria' });
    }

    // Fetch student records concurrently
    const [attendances, behaviors, complaints, notices, marks] = await Promise.all([
      Attendance.find({ studentId: admission._id }).sort({ date: -1 }),
      Behavior.find({ studentId: admission._id }).sort({ createdAt: -1 }),
      Complaint.find({ studentId: admission._id }).sort({ createdAt: -1 }),
      Notice.find({
        $or: [
          { targetStudentId: admission._id },
          { targetStream: 'All' },
          { targetStream: admission.previousStream }
        ]
      }).sort({ createdAt: -1 }),
      Marks.find({ studentId: admission._id }).sort({ createdAt: -1 })
    ]);

    res.json({
      student: admission,
      records: {
        attendances,
        behaviors,
        complaints,
        notices,
        marks
      }
    });
  } catch (error) {
    console.error('Error fetching student info:', error);
    res.status(500).json({ message: 'Server error fetching student info' });
  }
});

// Fetch all notices for public view
router.get('/notices', checkDbConnection, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: 'Server error fetching notices' });
  }
});

module.exports = router;
