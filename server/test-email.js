const path = require('path');
// Explicitly configure dotenv pointing to the server/.env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sendEmail } = require('./services/emailService');

const testEmailConnection = async () => {
  console.log('==================================================');
  console.log('📧 Nodemailer Email Dispatcher Verification Script');
  console.log('==================================================');
  
  const service = process.env.SMTP_SERVICE || '(none)';
  const host = process.env.SMTP_HOST || '(none)';
  const port = process.env.SMTP_PORT || '(none)';
  const user = process.env.SMTP_USER || '(none)';
  const pass = process.env.SMTP_PASS ? '********' : '(none)';

  console.log(`- SMTP_SERVICE : ${service}`);
  console.log(`- SMTP_HOST    : ${host}`);
  console.log(`- SMTP_PORT    : ${port}`);
  console.log(`- SMTP_USER    : ${user}`);
  console.log(`- SMTP_PASS    : ${pass}`);
  console.log('--------------------------------------------------');

  if (user === 'admissions@pcjabin.edu.in' && process.env.SMTP_PASS === 'your-secure-smtp-password') {
    console.log('⚠️  Default placeholders detected in server/.env.');
    console.log('   Please replace SMTP_USER and SMTP_PASS with your actual email and App Password.');
    console.log('==================================================');
    process.exit(0);
  }

  if ((!process.env.SMTP_SERVICE && !process.env.SMTP_HOST) || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ Missing required SMTP configuration variables in server/.env.');
    console.log('   Make sure you uncommented and populated the variables.');
    console.log('==================================================');
    process.exit(1);
  }

  console.log('Sending test email to yourself...');
  const subject = 'Test Email Connection - KLE BCA P. C. Jabin';
  const body = `Dear Developer / Administrator,

This is a test notification to verify that the Gmail SMTP server connection is working correctly.

If you received this, real email dispatches are now operational!

Warm regards,
KLE BCA Admissions System`;

  try {
    const result = await sendEmail(process.env.SMTP_USER, subject, body);
    console.log('--------------------------------------------------');
    console.log('Result Status:', result);
    if (result.success) {
      console.log('🎉 SUCCESS! Connection established and email dispatched.');
    } else {
      console.log('❌ FAILED! Email was not dispatched (fallback or error occurred).');
    }
  } catch (err) {
    console.error('❌ Exception during email test execution:', err);
  }
  console.log('==================================================');
};

testEmailConnection();
