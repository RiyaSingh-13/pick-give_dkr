const nodemailer = require('nodemailer');

/**
 * Sends a premium-styled email verification code via Nodemailer.
 * Falls back gracefully to console logs if SMTP credentials are missing or fail.
 */
const sendVerificationEmail = async (email, token) => {
  const user = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_PASS;
  
  if (!user || !rawPass) {
    console.log(`\n⚠️ [Nodemailer] SMTP credentials (EMAIL_USER / EMAIL_PASS) not configured in .env.`);
    console.log(`[Verification Fallback] Code for ${email} is: ${token}\n`);
    return;
  }

  // Automatically remove spaces from the Google App Password
  const pass = rawPass.replace(/\s+/g, '');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      }
    });

    const mailOptions = {
      from: `"Pick&Give Support" <${user}>`,
      to: email,
      subject: 'Verify Your Email Address - Pick&Give',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F8FAF5; padding: 40px 20px; text-align: center;">
          <div style="max-w: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(15, 52, 15, 0.05); border: 1px solid rgba(15, 52, 15, 0.05);">
            <!-- Logo Header -->
            <div style="font-size: 24px; font-weight: 800; color: #1A3828; margin-bottom: 24px; letter-spacing: -0.5px;">
              Pick<span style="color: #78A642;">&</span>Give
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(15, 52, 15, 0.08); margin-bottom: 30px;" />
            
            <h2 style="font-size: 22px; font-weight: 800; color: #1A3828; margin-bottom: 12px; margin-top: 0;">
              Verify Your Email Address
            </h2>
            
            <p style="font-size: 14px; color: #556B5D; line-height: 1.6; margin-bottom: 30px; font-weight: 500;">
              Welcome aboard! To complete your registration and secure your account, please enter the 6-digit verification code below:
            </p>
            
            <!-- Code Display -->
            <div style="background-color: #F0F4EC; border-radius: 16px; padding: 18px; font-size: 32px; font-weight: 800; color: #78A642; letter-spacing: 6px; margin-bottom: 30px; border: 1px solid rgba(120, 166, 66, 0.15); display: inline-block; min-width: 200px; text-align: center;">
              ${token}
            </div>
            
            <p style="font-size: 11px; color: #8C9F93; margin-bottom: 0; line-height: 1.5; font-weight: 600;">
              This code is valid for 15 minutes. If you did not request this code, please ignore this email.
            </p>
          </div>
          
          <div style="max-w: 500px; margin: 24px auto 0; text-align: center; font-size: 11px; color: #8C9F93; font-weight: 600;">
            © ${new Date().getFullYear()} Pick&Give. From Your Hands to Those in Need.
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Nodemailer] Verification email sent to ${email}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ [Nodemailer] Error sending email:', error);
    // Safe fallback so registration doesn't block if SMTP throws an error
    console.log(`[Verification Fallback] Code for ${email} is: ${token}`);
  }
};

module.exports = { sendVerificationEmail };
