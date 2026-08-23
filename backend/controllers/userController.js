// backend/controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const fallbackDb = require('../config/fallbackDb');
const emailService = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'pick-and-give-secret-key-12345';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email || user.officialEmail, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Register a new User (Member or NGO)
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { role, password } = req.body;

    if (!role || !['Member', 'NGO'].includes(role)) {
      return res.status(400).json({ error: 'Invalid or missing user role.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long and contain both letters and numbers.' });
    }

    // Determine email based on role
    const emailKey = role === 'NGO' ? 'officialEmail' : 'email';
    const emailVal = req.body[emailKey];

    if (!emailVal) {
      return res.status(400).json({ error: `${emailKey} is required.` });
    }

    // Dynamic Database Fallback Check
    if (!global.isDbConnected) {
      const existingUser = fallbackDb.findUserByEmail(emailVal);
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email already exists.' });
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = fallbackDb.saveUser({
        ...req.body,
        isVerified: false,
        emailVerificationToken: verificationCode
      });
      const nameStr = role === 'NGO' ? newUser.ngoName : newUser.fullName;
      fallbackDb.saveLog(`New ${role} "${nameStr}" registered (verification pending)`, role === 'NGO' ? 'Document' : 'User');
      
      try {
        await emailService.sendVerificationEmail(emailVal.toLowerCase(), verificationCode, nameStr);
      } catch (emailErr) {
        console.error('Failed to send verification email on registration (fallback DB):', emailErr);
      }
      
      return res.status(201).json({
        message: 'Registration successful. Verification code sent to email.',
        needsVerification: true,
        email: emailVal.toLowerCase()
      });
    }

    // Check if user already exists
    const query = {};
    query[emailKey] = emailVal.toLowerCase();
    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create User record
    const userData = { ...req.body };
    userData[emailKey] = emailVal.toLowerCase();
    userData.isVerified = false;
    userData.emailVerificationToken = verificationCode;

    const newUser = new User(userData);
    await newUser.save();

    // Log the registration event in System Audits
    const nameStr = role === 'NGO' ? newUser.ngoName : newUser.fullName;
    const newLog = new AuditLog({
      event: `New ${role} "${nameStr}" registered (verification pending)`,
      category: role === 'NGO' ? 'Document' : 'User'
    });
    await newLog.save();

    try {
      await emailService.sendVerificationEmail(emailVal.toLowerCase(), verificationCode, nameStr);
    } catch (emailErr) {
      console.error('Failed to send verification email on registration:', emailErr);
    }

    res.status(201).json({
      message: 'Registration successful. Verification code sent to email.',
      needsVerification: true,
      email: emailVal.toLowerCase()
    });
  } catch (error) {
    console.error('registerUser Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// @desc    Verify a user's email using 6-digit code
// @route   POST /api/users/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Fallback DB
    if (!global.isDbConnected) {
      const user = fallbackDb.verifyUserEmail(normalizedEmail, code);
      if (!user) {
        return res.status(400).json({ error: 'Incorrect or invalid email verification code.' });
      }
      const token = generateToken(user);
      fallbackDb.saveLog(`${user.role} "${user.fullName || user.ngoName}" email verified successfully`, 'User');
      return res.status(200).json({ token, user });
    }

    // MongoDB
    const user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { officialEmail: normalizedEmail }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    if (user.emailVerificationToken !== code) {
      return res.status(400).json({ error: 'Incorrect or invalid email verification code.' });
    }

    user.isVerified = true;
    user.emailVerificationToken = '';
    await user.save();

    const nameStr = user.role === 'NGO' ? user.ngoName : user.fullName;
    const newLog = new AuditLog({
      event: `${user.role} "${nameStr}" email verified successfully`,
      category: 'User'
    });
    await newLog.save();

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('verifyEmail Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get all Registered Members
// @route   GET /api/users/members
// @access  Public (or Admin)
exports.getMembers = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const members = fallbackDb.getMembers();
      return res.status(200).json(members);
    }

    const members = await User.find({ role: 'Member' }).sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    console.error('getMembers Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get all Registered NGOs
// @route   GET /api/users/ngos
// @access  Public (or Admin)
exports.getNgos = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const ngos = fallbackDb.getNgos();
      return res.status(200).json(ngos);
    }

    const ngos = await User.find({ role: 'NGO' }).sort({ createdAt: -1 });
    res.status(200).json(ngos);
  } catch (error) {
    console.error('getNgos Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Verify/Update NGO Status (Approve/Reject)
// @route   PUT /api/users/ngos/:id/verify
// @access  Admin
exports.verifyNgo = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status value.' });
    }

    if (!global.isDbConnected) {
      const ngo = fallbackDb.updateNgoStatus(req.params.id, status);
      if (!ngo) {
        return res.status(404).json({ error: 'NGO record not found.' });
      }
      fallbackDb.saveLog(`NGO "${ngo.ngoName}" status updated to: ${status} by administrator`, 'Document');
      
      try {
        await emailService.sendNgoStatusEmail(ngo.officialEmail, status, ngo.ngoName);
      } catch (emailErr) {
        console.error('Failed to send NGO status email (fallback DB):', emailErr);
      }
      
      return res.status(200).json(ngo);
    }

    const ngo = await User.findById(req.params.id);
    if (!ngo || ngo.role !== 'NGO') {
      return res.status(404).json({ error: 'NGO record not found.' });
    }

    ngo.status = status;
    await ngo.save();

    // Log administrative verification event in System Audits
    const newLog = new AuditLog({
      event: `NGO "${ngo.ngoName}" status updated to: ${status} by administrator`,
      category: 'Document'
    });
    await newLog.save();

    try {
      await emailService.sendNgoStatusEmail(ngo.officialEmail, status, ngo.ngoName);
    } catch (emailErr) {
      console.error('Failed to send NGO status email:', emailErr);
    }

    res.status(200).json(ngo);
  } catch (error) {
    console.error('verifyNgo Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Delete User Profile (Member or NGO)
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const deletedUser = fallbackDb.deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User profile not found.' });
      }
      const nameStr = deletedUser.role === 'NGO' ? deletedUser.ngoName : deletedUser.fullName;
      fallbackDb.saveLog(`Registered ${deletedUser.role} "${nameStr}" removed from system registry by administrator`, 'User');
      return res.status(200).json({ success: true, message: 'User profile deleted successfully.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const nameStr = user.role === 'NGO' ? user.ngoName : user.fullName;
    await User.findByIdAndDelete(req.params.id);

    // Log deletion event in System Audits
    const newLog = new AuditLog({
      event: `Registered ${user.role} "${nameStr}" removed from system registry by administrator`,
      category: 'User'
    });
    await newLog.save();

    res.status(200).json({ success: true, message: 'User profile deleted successfully.' });
  } catch (error) {
    console.error('deleteUser Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Login a user (Member or NGO)
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!global.isDbConnected) {
      const user = fallbackDb.findUserByEmail(normalizedEmail);
      if (!user) {
        return res.status(404).json({ error: 'No registered user found with this email address.' });
      }
      
      // Validate password
      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }

      const nameStr = user.role === 'NGO' ? user.ngoName : user.fullName;

      // Check email verification status
      if (!user.isVerified) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailVerificationToken = verificationCode;
        
        try {
          await emailService.sendVerificationEmail(normalizedEmail, verificationCode, nameStr);
        } catch (emailErr) {
          console.error('Failed to send verification email on login (fallback DB):', emailErr);
        }

        return res.status(200).json({
          message: 'Account is not verified yet. A verification code has been sent to your email.',
          needsVerification: true,
          email: normalizedEmail,
          role: user.role
        });
      }

      const token = generateToken(user);
      fallbackDb.saveLog(`${user.role} "${nameStr}" signed in successfully`, 'Auth');
      return res.status(200).json({ token, user });
    }
    
    // Find the user by email or officialEmail
    const user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { officialEmail: normalizedEmail }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'No registered user found with this email address.' });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const nameStr = user.role === 'NGO' ? user.ngoName : user.fullName;
    const targetEmail = user.role === 'NGO' ? user.officialEmail : user.email;

    // Check email verification status
    if (!user.isVerified) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.emailVerificationToken = verificationCode;
      await user.save();

      try {
        await emailService.sendVerificationEmail(targetEmail, verificationCode, nameStr);
      } catch (emailErr) {
        console.error('Failed to send verification email on login:', emailErr);
      }

      return res.status(200).json({
        message: 'Account is not verified yet. A verification code has been sent to your email.',
        needsVerification: true,
        email: targetEmail,
        role: user.role
      });
    }

    // Log the successful login in system audits
    const newLog = new AuditLog({
      event: `${user.role} "${nameStr}" signed in successfully`,
      category: 'Auth'
    });
    await newLog.save();

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('loginUser Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
