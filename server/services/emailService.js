const nodemailer = require('nodemailer');

/**
 * Sends a real email via Nodemailer if SMTP settings are configured.
 * Otherwise, falls back to local simulation mode.
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email plain-text message body
 * @returns {Promise<{success: boolean, mode: string, messageId?: string, error?: string}>}
 */
const sendEmail = async (to, subject, body) => {
  const service = process.env.SMTP_SERVICE;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Check if SMTP settings or service are provided in .env
  if ((!service && !host) || !user || !pass) {
    console.log('--------------------------------------------------');
    console.log(`⚠️  SMTP Email credentials or service missing in server/.env.`);
    console.log('   Falling back to LOCAL SIMULATION mode.');
    console.log('--------------------------------------------------');
    return { success: false, mode: 'simulation' };
  }

  try {
    let transportConfig;
    if (service) {
      transportConfig = {
        service: service,
        auth: {
          user: user,
          pass: pass
        },
        tls: {
          rejectUnauthorized: false
        }
      };
    } else {
      transportConfig = {
        host: host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: {
          user: user,
          pass: pass
        },
        tls: {
          rejectUnauthorized: false
        }
      };
    }

    const transporter = nodemailer.createTransport(transportConfig);

    const info = await transporter.sendMail({
      from: `"KLE Jabin College Admissions" <${user}>`,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    });

    console.log(`✅ Real Email dispatched via SMTP to ${to}. Message ID: ${info.messageId}`);
    return { success: true, mode: 'smtp', messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to dispatch SMTP email:', error.message);
    return { success: false, mode: 'error', error: error.message };
  }
};

module.exports = { sendEmail };
