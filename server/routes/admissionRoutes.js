const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Admission = require('../models/Admission');
const SmsLog = require('../models/SmsLog');
const EmailLog = require('../models/EmailLog');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendRealSms } = require('../services/smsService');
const { sendEmail } = require('../services/emailService');
const mongoose = require('mongoose');

// Middleware to verify database connectivity before processing queries
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is currently offline. Please ensure MongoDB is running and configure MONGO_URI.'
    });
  }
  next();
};

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (Optional but recommended: only allow images and PDFs)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG/PNG) and PDFs are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// The list of documents to accept
const uploadFields = upload.fields([
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'incomeCaste', maxCount: 1 },
  { name: 'fatherAadhaar', maxCount: 1 },
  { name: 'motherAadhaar', maxCount: 1 },
  { name: 'pucMarksCard', maxCount: 1 },
  { name: 'sslcMarksCard', maxCount: 1 },
  { name: 'studentSignature', maxCount: 1 }
]);

// @route   POST /api/admissions
// @desc    Submit new admission form
// @access  Public
router.post('/', uploadFields, async (req, res) => {
  // Check DB status inside the handler after files are processed by Multer
  if (mongoose.connection.readyState !== 1) {
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        req.files[key].forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
    return res.status(503).json({
      message: 'Database is currently offline. Please ensure MongoDB is running and configure MONGO_URI.'
    });
  }

  try {
    const {
      studentName,
      motherName,
      fatherName,
      aadhaarNumber,
      parentAadhaarNumber,
      parentPhone,
      parentEmail,
      studentPhone,
      studentEmail,
      dob,
      previousStream,
      previousCollege,
      pucBoard,
      pucMarks,
      pucCgpa,
      pucPercentage,
      sslcBoard,
      sslcMarks,
      sslcCgpa,
      sslcPercentage,
      permanentAddress
    } = req.body;

    // Check required uploaded files
    const requiredFiles = [
      'aadhaarCard',
      'incomeCaste',
      'fatherAadhaar',
      'motherAadhaar',
      'pucMarksCard',
      'sslcMarksCard',
      'studentSignature'
    ];

    const missingFiles = [];
    requiredFiles.forEach((fieldName) => {
      if (!req.files || !req.files[fieldName]) {
        missingFiles.push(fieldName);
      }
    });

    if (missingFiles.length > 0) {
      // Clean up already uploaded files if there's an error
      if (req.files) {
        Object.keys(req.files).forEach((key) => {
          req.files[key].forEach((file) => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        });
      }
      return res.status(400).json({
        message: `Missing required file uploads: ${missingFiles.join(', ')}`
      });
    }

    // Build the documents file paths map
    const documentPaths = {
      aadhaarCard: req.files['aadhaarCard'][0].filename,
      panCard: req.files['panCard'] ? req.files['panCard'][0].filename : '',
      incomeCaste: req.files['incomeCaste'][0].filename,
      fatherAadhaar: req.files['fatherAadhaar'][0].filename,
      motherAadhaar: req.files['motherAadhaar'][0].filename,
      pucMarksCard: req.files['pucMarksCard'][0].filename,
      sslcMarksCard: req.files['sslcMarksCard'][0].filename,
      studentSignature: req.files['studentSignature'][0].filename
    };

    // Clean and validate inputs to prevent casting issues in Mongoose
    const admissionData = {
      studentName,
      motherName,
      fatherName,
      aadhaarNumber,
      parentAadhaarNumber: parentAadhaarNumber || '',
      parentPhone,
      parentEmail,
      studentPhone,
      studentEmail: studentEmail || '',
      dob,
      previousStream,
      previousCollege,
      pucBoard: pucBoard || 'State',
      sslcBoard: sslcBoard || 'State',
      pucPercentage: parseFloat(pucPercentage) || 0,
      sslcPercentage: parseFloat(sslcPercentage) || 0,
      permanentAddress,
      documents: documentPaths
    };

    if (admissionData.pucBoard === 'State') {
      if (pucMarks !== undefined && pucMarks !== '') {
        admissionData.pucMarks = parseFloat(pucMarks);
      }
    } else {
      if (pucCgpa !== undefined && pucCgpa !== '') {
        admissionData.pucCgpa = parseFloat(pucCgpa);
      }
    }

    if (admissionData.sslcBoard === 'State') {
      if (sslcMarks !== undefined && sslcMarks !== '') {
        admissionData.sslcMarks = parseFloat(sslcMarks);
      }
    } else {
      if (sslcCgpa !== undefined && sslcCgpa !== '') {
        admissionData.sslcCgpa = parseFloat(sslcCgpa);
      }
    }

    // Save admission
    const newAdmission = new Admission(admissionData);
    const savedAdmission = await newAdmission.save();

    // Trigger automatic confirmation email to parent upon successful form submission
    if (savedAdmission.parentEmail) {
      const teacherEmail = process.env.SMTP_USER || 'admissions@pcjabin.edu.in';
      const submissionSubject = `Admission Application Received - KLE's BCA P. C. Jabin Science College Hubballi`;
      
      const sslcDetails = savedAdmission.sslcBoard === 'CBSE' 
        ? `CBSE CGPA ${savedAdmission.sslcCgpa}/10` 
        : `State Board Marks ${savedAdmission.sslcMarks}/625`;

      const pucDetails = savedAdmission.pucBoard === 'CBSE' 
        ? `CBSE CGPA ${savedAdmission.pucCgpa}/10` 
        : `State Board Marks ${savedAdmission.pucMarks}/600`;

      const submissionBody = `Dear Parent/Guardian,

We have successfully received the provisional admission application for your ward, ${studentName}.

Details of Submission:
- Candidate Name: ${studentName}
- Application ID: ${savedAdmission._id}
- Previous Stream: ${previousStream}
- SSLC: ${sslcDetails} (${savedAdmission.sslcPercentage}%)
- PUC II: ${pucDetails} (${savedAdmission.pucPercentage}%)
- Status: Pending Review

The admissions committee will review the submitted documents shortly. You will receive an automated email notification once the admission is approved or rejected by the teacher.

If you have any questions, please contact the admissions desk at:
- Email: ${teacherEmail}
- Phone: +91 836 237 2285

Warm regards,
Admissions Committee
KLE's BCA P. C. Jabin Science College Hubballi`;

      try {
        // Create EmailLog entry
        const log = new EmailLog({
          recipientEmail: savedAdmission.parentEmail,
          studentName: savedAdmission.studentName,
          subject: submissionSubject,
          body: submissionBody,
          type: 'Submission'
        });
        await log.save();

        // Dispatch email
        await sendEmail(savedAdmission.parentEmail, submissionSubject, submissionBody);

        console.log(`✅ Automatic submission confirmation email sent to ${savedAdmission.parentEmail}`);
      } catch (emailErr) {
        console.error('⚠️ Failed to send automatic submission email:', emailErr.message);
      }
    }

    res.status(201).json(savedAdmission);
  } catch (error) {
    console.error('Error submitting admission:', error);
    // Cleanup files if exception occurs
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        req.files[key].forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
    res.status(500).json({ message: error.message || 'Server error during submission' });
  }
});

// @route   GET /api/admissions
// @desc    Get all admissions (Admin only view - standard backend endpoint)
// @access  Public (For demo, simple endpoint)
router.get('/', checkDbConnection, async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ message: 'Server error fetching admissions' });
  }
});

// @route   GET /api/admissions/sms-logs
// @desc    Get all simulated SMS logs
// @access  Public
router.get('/sms-logs', checkDbConnection, async (req, res) => {
  try {
    const logs = await SmsLog.find().sort({ sentAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    res.status(500).json({ message: 'Server error fetching SMS logs' });
  }
});

// @route   GET /api/admissions/email-logs
// @desc    Get all simulated Email logs
// @access  Public
router.get('/email-logs', checkDbConnection, async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ sentAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching Email logs:', error);
    res.status(500).json({ message: 'Server error fetching Email logs' });
  }
});

// @route   GET /api/admissions/aadhaar/:aadhaar
// @desc    Get admission status by Aadhaar card number
// @access  Public
router.get('/aadhaar/:aadhaar', checkDbConnection, async (req, res) => {
  try {
    const { aadhaar } = req.params;
    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ message: 'Please provide a valid 12-digit Aadhaar number' });
    }

    const admission = await Admission.findOne({ aadhaarNumber: aadhaar });
    if (!admission) {
      return res.status(404).json({ message: 'No admission form found for this Aadhaar card number' });
    }
    res.json(admission);
  } catch (error) {
    console.error('Error checking status by Aadhaar:', error);
    res.status(500).json({ message: 'Server error looking up application' });
  }
});

// @route   GET /api/admissions/:id
// @desc    Get single admission details
// @access  Public
router.get('/:id', checkDbConnection, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission application not found' });
    }
    res.json(admission);
  } catch (error) {
    console.error('Error fetching admission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/admissions/:id/status
// @desc    Update admission status (Approve/Reject) and dispatch SMS/Email simulation
// @access  Public
router.patch('/:id/status', checkDbConnection, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateFields = { status };
    if (status === 'Rejected') {
      updateFields.rejectionReason = rejectionReason || 'Reason not provided';
    } else if (status === 'Approved') {
      updateFields.rejectionReason = ''; // Clear if approved
    }

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({ message: 'Admission application not found' });
    }

    // Simulate SMS/Email dispatching and save logs
    let smsMessage = '';
    let emailSubject = '';
    let emailBody = '';

    if (status === 'Approved') {
      smsMessage = `Dear Parent, admission for ${admission.studentName} is approved. Please proceed with the fees payments by visiting the college. - KLE's P.C. Jabin College Hubballi`;
      
      emailSubject = `Admission Application Approved - KLE's BCA P. C. Jabin Science College Hubballi`;
      emailBody = `Dear Parent/Guardian,

We are pleased to inform you that the provisional admission application for your ward, ${admission.studentName}, has been ACCEPTED.

Details of College to Visit for Final Admissions:
- College Name: KLE's BCA P. C. Jabin Science College Hubballi
- Address: Vidya Nagar, Hubballi, Karnataka 580031
- Contact Number: +91 836 237 2285
- Email: ${process.env.SMTP_USER || 'admissions@pcjabin.edu.in'}
- Office Timings: Monday to Saturday, 10:00 AM - 5:00 PM

Next Steps:
Please visit the college campus with all original documents (Aadhaar Card, SSLC Marks Card, PUC II Marks Card, and Income/Caste certificates) and passport size photos to complete the verification and pay the admission fee.

Congratulations and welcome to KLE's P. C. Jabin Science College!

Warm regards,
Admissions Committee
KLE's BCA P. C. Jabin Science College Hubballi`;
    } else if (status === 'Rejected') {
      smsMessage = `Dear Parent, admission for ${admission.studentName} is rejected. Reason: ${updateFields.rejectionReason}. - KLE's P.C. Jabin College Hubballi`;
      
      emailSubject = `Admission Application Rejection Notice - KLE's BCA P. C. Jabin Science College Hubballi`;
      emailBody = `Dear Parent/Guardian,

We regret to inform you that the provisional admission application for your ward, ${admission.studentName}, has been REJECTED.

Details / Reasons for Rejection:
${updateFields.rejectionReason}

If you believe this was an error or wish to rectify the document issues, you may login to the portal and upload the corrected files or contact the admissions desk at:
- College Name: KLE's BCA P. C. Jabin Science College Hubballi
- Address: Vidya Nagar, Hubballi, Karnataka 580031
- Contact Number: +91 836 237 2285
- Email: ${process.env.SMTP_USER || 'admissions@pcjabin.edu.in'}

Warm regards,
Admissions Committee
KLE's BCA P. C. Jabin Science College Hubballi`;
    }

    if (smsMessage) {
      // Create SmsLog entry
      const log = new SmsLog({
        recipientPhone: admission.parentPhone,
        studentName: admission.studentName,
        message: smsMessage,
        type: status === 'Approved' ? 'Approval' : 'Rejection'
      });
      await log.save();

      // Log simulated transmission output to Node console
      console.log('--------------------------------------------------');
      console.log(`[IN-APP CELLULAR SMS LOG - ${status.toUpperCase()}]`);
      console.log(`TO: Parent (${admission.parentPhone})`);
      console.log(`MESSAGE: "${smsMessage}"`);
      console.log('--------------------------------------------------');
    }

    if (emailBody && admission.parentEmail) {
      // Create EmailLog entry
      const log = new EmailLog({
        recipientEmail: admission.parentEmail,
        studentName: admission.studentName,
        subject: emailSubject,
        body: emailBody,
        type: status === 'Approved' ? 'Approval' : 'Rejection'
      });
      await log.save();

      // Send the email (handles SMTP if credentials exist, otherwise outputs console simulation)
      await sendEmail(admission.parentEmail, emailSubject, emailBody);

      // Log simulated transmission output to Node console
      console.log('--------------------------------------------------');
      console.log(`[IN-APP SMTP EMAIL LOG - ${status.toUpperCase()}]`);
      console.log(`TO: Parent (${admission.parentEmail})`);
      console.log(`SUBJECT: "${emailSubject}"`);
      console.log(`BODY:\n${emailBody}`);
      console.log('--------------------------------------------------');
    }

    res.json(admission);
  } catch (error) {
    console.error('Error updating admission status:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// @route   PATCH /api/admissions/:id/uucms-roll
// @desc    Manually assign UUCMS Number and Roll Number to student and notify parent via email
// @access  Public
router.patch('/:id/uucms-roll', checkDbConnection, async (req, res) => {
  try {
    const { uucmsNo, rollNo } = req.body;
    if (!uucmsNo || !rollNo) {
      return res.status(400).json({ message: 'Both UUCMS Number and Roll Number are required' });
    }

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { uucmsNo: uucmsNo.trim(), rollNo: rollNo.trim() },
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({ message: 'Student admission record not found' });
    }
    res.json(admission);
  } catch (error) {
    console.error('Error assigning UUCMS & Roll No:', error);
    res.status(500).json({ message: error.message || 'Server error assigning UUCMS and Roll number' });
  }
});

module.exports = router;
