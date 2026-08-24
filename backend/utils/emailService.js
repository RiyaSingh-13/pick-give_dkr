const nodemailer = require('nodemailer');

// Create the transporter using Gmail settings in env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer transporter connection error:', error.message);
  } else {
    console.log('📬 Nodemailer transporter is ready to deliver messages.');
  }
});

/**
 * Sends a registration/login email verification code.
 */
const sendVerificationEmail = async (toEmail, code, userName) => {
  const mailOptions = {
    from: `"Pick&Give Helpdesk" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Verify Your Email - Pick&Give [${code}]`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fcfdfa;">
        <div style="text-align: center; border-bottom: 2px solid #78A642; padding-bottom: 20px; margin-bottom: 25px;">
          <h1 style="color: #0F340F; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Pick&Give</h1>
          <p style="color: #78A642; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">From Your Hands to Those in Need</p>
        </div>
        
        <div style="color: #2d3748; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Thank you for joining the Pick&Give community. To complete your account setup and verify your email address, please use the 6-digit verification code below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #0F340F; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 12px 30px; border-radius: 8px; border: 1px solid #78A642; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-indent: 8px;">${code}</span>
          </div>
          
          <p style="font-size: 14px; color: #4a5568;">This verification code is valid for 30 minutes. If you did not initiate this registration or login attempt, please ignore this email or reach out to our support team.</p>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #718096; font-size: 12px;">
          <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Pick&Give Portal. All rights reserved.</p>
          <p style="margin: 0;">Need help? Contact us at <a href="mailto:support@pickandgive.org" style="color: #78A642; text-decoration: none; font-weight: 600;">support@pickandgive.org</a></p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends status updates (Approved/Rejected) to registering NGOs.
 */
const sendNgoStatusEmail = async (toEmail, status, ngoName) => {
  const isApproved = status === 'Approved';
  const color = isApproved ? '#78A642' : '#e53e3e';
  const statusText = isApproved ? 'APPROVED' : 'REJECTED';
  
  const content = isApproved 
    ? `<p>Congratulations! Your NGO profile status has been reviewed and is now <strong>Approved</strong> by the administrator.</p>
       <p>You can now log in to the Pick&Give platform to claim material donations, post active supply requirements, and coordinate delivery routes with volunteers.</p>`
    : `<p>We regret to inform you that your NGO profile verification has been <strong>Rejected</strong> by the administrator.</p>
       <p>Please ensure that your registration number and verification certificate are valid and clear. You can re-register or appeal this decision by reaching out to our support team.</p>`;

  const mailOptions = {
    from: `"Pick&Give Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `NGO Profile Status Update - ${statusText}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fcfdfa;">
        <div style="text-align: center; border-bottom: 2px solid ${color}; padding-bottom: 20px; margin-bottom: 25px;">
          <h1 style="color: #0F340F; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Pick&Give</h1>
          <p style="color: ${color}; margin: 5px 0 0 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">NGO Profile status update</p>
        </div>
        
        <div style="color: #2d3748; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          <p>Hello <strong>${ngoName}</strong>,</p>
          ${content}
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #718096; font-size: 12px;">
          <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Pick&Give Portal. All rights reserved.</p>
          <p style="margin: 0;">Need help? Contact us at <a href="mailto:support@pickandgive.org" style="color: #78A642; text-decoration: none; font-weight: 600;">support@pickandgive.org</a></p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends the delivery verification OTP to the NGO.
 */
const sendDeliveryOtpEmail = async (toEmail, otp, ngoName, donationTitle, deliveryPersonName) => {
  const mailOptions = {
    from: `"Pick&Give Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Delivery Handoff OTP for "${donationTitle}" - Pick&Give [${otp}]`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fcfdfa;">
        <div style="text-align: center; border-bottom: 2px solid #78A642; padding-bottom: 20px; margin-bottom: 25px;">
          <h1 style="color: #0F340F; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Pick&Give</h1>
          <p style="color: #78A642; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Delivery Handoff Verification</p>
        </div>
        
        <div style="color: #2d3748; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          <p>Hello <strong>${ngoName} Team</strong>,</p>
          <p>A delivery is currently on the way to your facility for the donation offer: <strong>"${donationTitle}"</strong>.</p>
          <p>Delivery Courier: <strong>${deliveryPersonName}</strong></p>
          <p>When the delivery person arrives at your facility with the items, please inspect the package and provide them with the following 4-digit Delivery Handoff OTP to verify and complete the run:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #78A642; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 12px 30px; border-radius: 8px; border: 1px solid #0F340F; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-indent: 6px;">${otp}</span>
          </div>
          
          <p style="font-size: 14px; color: #4a5568;">By sharing this code with the courier, you confirm that your organization has safely received the donated items.</p>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #718096; font-size: 12px;">
          <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Pick&Give Portal. All rights reserved.</p>
          <p style="margin: 0;">Need help? Contact us at <a href="mailto:support@pickandgive.org" style="color: #78A642; text-decoration: none; font-weight: 600;">support@pickandgive.org</a></p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendNgoStatusEmail,
  sendDeliveryOtpEmail
};

