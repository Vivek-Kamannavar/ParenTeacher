const twilio = require('twilio');

/**
 * Sends a real cellular SMS via Twilio if environment variables are configured.
 * Otherwise, falls back to local simulation mode.
 * 
 * @param {string} to - Recipient phone number (e.g. 9876543210)
 * @param {string} body - SMS message body text
 * @returns {Promise<{success: boolean, mode: string, sid?: string, error?: string}>}
 */
const sendRealSms = async (to, body) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  // Check if Twilio keys are provided in .env
  if (!accountSid || !authToken || !twilioNumber) {
    console.log('--------------------------------------------------');
    console.log('⚠️  Twilio SMS credentials missing in server/.env.');
    console.log('   Falling back to LOCAL SIMULATION mode.');
    console.log('--------------------------------------------------');
    return { success: false, mode: 'simulation' };
  }

  try {
    const client = twilio(accountSid, authToken);

    // Format recipient phone number to E.164 (Twilio requires E.164)
    let formattedTo = to.trim();
    if (!formattedTo.startsWith('+')) {
      // If it is a 10-digit number, assume India (+91) based on the Hubballi college context
      if (formattedTo.length === 10) {
        formattedTo = `+91${formattedTo}`;
      } else {
        // Fallback: try prepending '+' if it has a country code prefix but missing '+'
        formattedTo = `+${formattedTo}`;
      }
    }

    // Dispatch real SMS
    const message = await client.messages.create({
      body: body,
      from: twilioNumber,
      to: formattedTo
    });

    console.log(`✅ Real SMS dispatched via Twilio to ${formattedTo}. Message SID: ${message.sid}`);
    return { success: true, mode: 'twilio', sid: message.sid };
  } catch (error) {
    console.error('❌ Failed to dispatch real Twilio SMS:', error.message);
    return { success: false, mode: 'error', error: error.message };
  }
};

module.exports = { sendRealSms };
