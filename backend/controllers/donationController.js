// backend/controllers/donationController.js
const Donation = require('../models/Donation');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const fallbackDb = require('../config/fallbackDb');

// Nayi donation book karne wala controller
exports.createDonation = async (req, res) => {
  try {
    // Request body se donation ki details nikal rahe hain
    const { title, category, donor, donorEmail, ngo, location, description, instructions, photo, deliveryMode } = req.body;

    // Zaroori fields check kar rahe hain, agar koi field missing hai to error return karenge
    if (!title || !category || !donor || !donorEmail || !ngo || !location) {
      return res.status(400).json({ error: 'Missing required donation booking fields.' });
    }

    // Agar MongoDB connected nahi hai to fallback database use hoga
    if (!global.isDbConnected) {
      // Fallback DB me donation save karna aur delivery mode ke hisab se courier status set karna
      const newDonation = fallbackDb.saveDonation({
        ...req.body,
        courier: deliveryMode === 'Self' ? 'Self (Donor Delivery)' : 'None (Awaiting Courier)'
      });
      // Audit log save karna fallback DB me
      fallbackDb.saveLog(`Member "${donor}" booked new donation: "${title}" for "${ngo}"`, 'Action');
      // Success response bhejna
      return res.status(201).json(newDonation);
    }

    // MongoDB ke liye naya Donation object banana
    const newDonation = new Donation({
      title,
      category,
      donor,
      donorEmail,
      ngo,
      location,
      description,
      instructions,
      photo,
      deliveryMode,
      courier: deliveryMode === 'Self' ? 'Self (Donor Delivery)' : 'None (Awaiting Courier)'
    });

    // Donation ko database me save karna
    await newDonation.save();

    // Audit log save karne ke liye object banana
    const newLog = new AuditLog({
      event: `Member "${donor}" booked new donation: "${title}" for "${ngo}"`,
      category: 'Action'
    });
    // Audit log ko save karna
    await newLog.save();

    // Success response bhejna
    res.status(201).json(newDonation);
  } catch (error) {
    // Error ko console me print karna
    console.error('createDonation Error:', error);
    // Internal Server Error response bhejna
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Saari booked donations ko fetch karne wala controller
exports.getDonations = async (req, res) => {
  try {
    // Agar MongoDB connected nahi hai to fallback database se list lana
    if (!global.isDbConnected) {
      // Fallback DB se saari donations fetch karna
      const donations = fallbackDb.getDonations();
      // Response me list return karna
      return res.status(200).json(donations);
    }

    // MongoDB se saari donations fetch karna aur unhe new to old (descending order) me sort karna
    const donations = await Donation.find().sort({ createdAt: -1 });

    // Success response bhejna
    res.status(200).json(donations);
  } catch (error) {
    // Error ko console me print karna
    console.error('getDonations Error:', error);
    // Internal Server Error response bhejna
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// NGO ke dwara donation accept karne wala controller
exports.acceptDonation = async (req, res) => {
  try {
    // Request body se NGO ka naam nikal rahe hain
    const { ngo } = req.body;

    // Agar NGO name nahi aaya to request reject
    if (!ngo) {
      return res.status(400).json({
        error: 'NGO name is required.'
      });
    }

    // Agar MongoDB connected nahi hai to fallback database use hoga
    if (!global.isDbConnected) {
      // Fallback DB ke saare users lana
      const allUsers = fallbackDb.getUsers();

      // NGO ko search karna
      const matchedNgo = allUsers.find(
        u => u.role === 'NGO' && u.ngoName === ngo
      );

      // Agar NGO Approved nahi hai to donation accept nahi kar sakta
      if (matchedNgo && matchedNgo.status !== 'Approved') {
        return res.status(403).json({
          error: `Your NGO profile status is currently "${matchedNgo.status}". You cannot accept donation offers until approved by the administrator.`
        });
      }
    } else {
      // MongoDB se NGO ko search karna
      const matchedNgo = await User.findOne({
        role: 'NGO',
        ngoName: ngo
      });

      // NGO Approved nahi hai to reject
      if (matchedNgo && matchedNgo.status !== 'Approved') {
        return res.status(403).json({
          error: `Your NGO profile status is currently "${matchedNgo.status}". You cannot accept donation offers until approved by the administrator.`
        });
      }
    }

    // Agar MongoDB connected nahi hai
    if (!global.isDbConnected) {
      // Donation update karne ke liye object banana (status aur ngo direct set kar rahe hain)
      const updates = {
        status: 'Accepted',
        ngo: ngo
      };

      // Fallback DB me donation update karna
      const donation = fallbackDb.updateDonation(
        req.params.id,
        updates
      );

      // Donation nahi mili
      if (!donation) {
        return res.status(404).json({
          error: 'Donation record not found.'
        });
      }

      // Log save karna
      fallbackDb.saveLog(
        `NGO "${donation.ngo}" accepted donation offer "${donation.title}"`,
        'Action'
      );

      // Updated donation return karna
      return res.status(200).json(donation);
    }

    // MongoDB se Donation search karna
    const donation = await Donation.findById(req.params.id);

    // Donation exist nahi karti
    if (!donation) {
      return res.status(404).json({
        error: 'Donation record not found.'
      });
    }

    // NGO update karna
    if (ngo) {
      donation.ngo = ngo;
    }

    // Status Accepted karna
    donation.status = 'Accepted';

    // Changes database me save karna
    await donation.save();

    // Audit Log create karna
    const newLog = new AuditLog({
      event: `NGO "${donation.ngo}" accepted donation offer "${donation.title}"`,
      category: 'Action'
    });

    // Audit Log database me save karna
    await newLog.save();

    // Success response bhejna
    res.status(200).json(donation);
  } catch (error) {
    // Error console me print karna
    console.error('acceptDonation Error:', error);

    // Internal Server Error bhejna
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

// Volunteer ke dwara delivery run claim ya release karne wala controller
exports.claimDonationRun = async (req, res) => {
  try {
    // Request body se volunteer ka naam nikal rahe hain
    const { volunteerName } = req.body;
    // Agar volunteer name nahi aaya to request reject karna
    if (!volunteerName) {
      return res.status(400).json({ error: 'Volunteer name is required.' });
    }

    // Agar MongoDB connected nahi hai to fallback database use hoga
    if (!global.isDbConnected) {
      // Fallback DB se donation check karna
      const donation = fallbackDb.findDonationById(req.params.id);
      // Agar donation nahi mili to 404 error return karna
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }

      // Check karna ki kya ye donation pehle se is volunteer ne claim ki hui hai
      const isCurrentlyClaimed = donation.courier && donation.courier.startsWith(volunteerName);
      let updates = {};

      if (isCurrentlyClaimed) {
        // Delivery task ko release (wapas free) karne ke updates set karna
        updates = {
          status: 'Accepted',
          courier: 'None (Awaiting Courier)'
        };
        // Fallback DB me updates apply karna
        fallbackDb.updateDonation(req.params.id, updates);
        // Delivery release ka log save karna
        fallbackDb.saveLog(`Volunteer "${volunteerName}" released delivery run for "${donation.title}"`, 'Delivery');
      } else {
        // Delivery task ko claim (OTP pickup ka intzar) karne ke updates set karna
        updates = {
          status: 'Accepted',
          courier: `${volunteerName} (Claimed - Awaiting Pickup)`
        };
        // Fallback DB me updates apply karna
        fallbackDb.updateDonation(req.params.id, updates);
        // Delivery claim ka log save karna
        fallbackDb.saveLog(`Volunteer "${volunteerName}" claimed delivery run for "${donation.title}" (Awaiting OTP)`, 'Delivery');
      }

      // Updated donation ko fetch karke return karna
      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    // MongoDB se donation fetch karna
    const donation = await Donation.findById(req.params.id);
    // Agar donation nahi mili to 404 error return karna
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    // Check karna ki kya ye donation pehle se is volunteer ne claim ki hui hai
    const isCurrentlyClaimed = donation.courier && donation.courier.startsWith(volunteerName);

    if (isCurrentlyClaimed) {
      // Release Task: status aur courier status ko reset karna
      donation.status = 'Accepted';
      donation.courier = 'None (Awaiting Courier)';
      // Changes ko database me save karna
      await donation.save();

      // System audit log record banana
      const newLog = new AuditLog({
        event: `Volunteer "${volunteerName}" released delivery run for "${donation.title}"`,
        category: 'Delivery'
      });
      // Audit log save karna
      await newLog.save();
    } else {
      // Claim Task: status aur courier details set karna
      donation.status = 'Accepted';
      donation.courier = `${volunteerName} (Claimed - Awaiting Pickup)`;
      // Changes ko database me save karna
      await donation.save();

      // System audit log record banana
      const newLog = new AuditLog({
        event: `Volunteer "${volunteerName}" claimed delivery run for "${donation.title}" (Awaiting OTP)`,
        category: 'Delivery'
      });
      // Audit log save karna
      await newLog.save();
    }

    // Updated donation data return karna
    res.status(200).json(donation);
  } catch (error) {
    // Error ko console me print karna
    console.error('claimDonationRun Error:', error);
    // Internal Server Error response bhejna
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Donation delivery ko complete mark karne wala controller
exports.completeDonationDelivery = async (req, res) => {
  try {
    // Request body se volunteer ka naam nikal rahe hain
    const { volunteerName } = req.body;
    // Agar volunteer name nahi aaya to request reject karna
    if (!volunteerName) {
      return res.status(400).json({ error: 'Volunteer name is required.' });
    }

    // Agar MongoDB connected nahi hai to fallback database use hoga
    if (!global.isDbConnected) {
      // Fallback DB se donation check karna
      const donation = fallbackDb.findDonationById(req.params.id);
      // Agar donation nahi mili to 404 error return karna
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }

      // Status ko Delivered aur courier ko Completed mark karne ke updates
      const updates = {
        status: 'Delivered',
        courier: `${volunteerName} (Completed)`
      };
      // Fallback DB me donation status update karna
      fallbackDb.updateDonation(req.params.id, updates);
      // Delivery completed ka log save karna
      fallbackDb.saveLog(`Delivery completed for "${donation.title}" by "${volunteerName}"`, 'Delivery');

      // Updated donation database se fetch karke return karna
      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    // MongoDB se donation fetch karna
    const donation = await Donation.findById(req.params.id);
    // Agar donation nahi mili to 404 error return karna
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    // Status aur courier update karna
    donation.status = 'Delivered';
    donation.courier = `${volunteerName} (Completed)`;
    // Changes ko database me save karna
    await donation.save();

    // Audit Log record create karna
    const newLog = new AuditLog({
      event: `Delivery completed for "${donation.title}" by "${volunteerName}"`,
      category: 'Delivery'
    });
    // Audit log save karna
    await newLog.save();

    // Success response return karna
    res.status(200).json(donation);
  } catch (error) {
    // Error ko console me print karna
    console.error('completeDonationDelivery Error:', error);
    // Internal Server Error response bhejna
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// OTP verify karke pickup confirm karne aur transit start karne wala controller
exports.verifyPickup = async (req, res) => {
  try {
    // Request body se verification OTP aur volunteer name nikal rahe hain
    const { otp, volunteerName } = req.body;
    // OTP mandatory hai, na hone par status 400 return karna
    if (!otp) {
      return res.status(400).json({ error: 'Verification OTP is required.' });
    }
    // Volunteer ka naam bhi mandatory hai
    if (!volunteerName) {
      return res.status(400).json({ error: 'Volunteer name is required.' });
    }

    // Agar MongoDB connected nahi hai to fallback database use hoga
    if (!global.isDbConnected) {
      // Fallback DB se donation check karna
      const donation = fallbackDb.findDonationById(req.params.id);
      // Donation nahi mili to error return karna
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }

      // Check karna ki request ka OTP database wale OTP se match ho raha hai ya nahi
      if (donation.otp !== otp) {
        return res.status(400).json({ error: 'Incorrect pickup verification OTP. Please verify with the donor.' });
      }

      // Status ko In Transit karne aur courier ko Active set karne ke updates
      const updates = {
        status: 'In Transit',
        courier: `${volunteerName} (Active)`
      };
      // Fallback DB me updates apply karna
      fallbackDb.updateDonation(req.params.id, updates);
      // Transit start ka audit log save karna
      fallbackDb.saveLog(`Pickup verified & transit started for "${donation.title}" by "${volunteerName}"`, 'Delivery');

      // Updated donation record key details return karna
      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    // MongoDB se donation fetch karna
    const donation = await Donation.findById(req.params.id);
    // Donation nahi mili to error return karna
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    // Check karna ki input OTP database validation OTP se match karta hai ya nahi
    if (donation.otp !== otp) {
      return res.status(400).json({ error: 'Incorrect pickup verification OTP. Please verify with the donor.' });
    }

    // Status aur courier ko update karna transit level par
    donation.status = 'In Transit';
    donation.courier = `${volunteerName} (Active)`;
    // Changes save karna database me
    await donation.save();

    // Audit log object create karna
    const newLog = new AuditLog({
      event: `Pickup verified & transit started for "${donation.title}" by "${volunteerName}"`,
      category: 'Delivery'
    });
    // Log save karna database me
    await newLog.save();

    // Success response return karna
    res.status(200).json(donation);
  } catch (error) {
    // Error ko console me print karna
    console.error('verifyPickup Error:', error);
    // Internal Server Error response bhejna
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Donor dwara khud delivery (self-delivery) ke liye transit shuru karne wala controller
exports.startSelfTransit = async (req, res) => {
  try {
    // Agar MongoDB connected nahi hai to fallback database use hoga
    if (!global.isDbConnected) {
      // Fallback DB se donation check karna
      const donation = fallbackDb.findDonationById(req.params.id);
      // Agar donation nahi mili to error return karna
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }
      // Status ko In Transit mark karna
      const updates = {
        status: 'In Transit'
      };
      // Fallback DB me updates save karna
      fallbackDb.updateDonation(req.params.id, updates);
      // Self-delivery transit start karne ka log save karna
      fallbackDb.saveLog(`Donor started self-delivery transit for "${donation.title}"`, 'Delivery');
      // Updated donation return karna
      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    // MongoDB se donation fetch karna
    const donation = await Donation.findById(req.params.id);
    // Agar donation nahi mili to error return karna
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    // Status ko In Transit set karna
    donation.status = 'In Transit';
    // Database me update save karna
    await donation.save();

    // Audit log prepare karna
    const newLog = new AuditLog({
      event: `Donor started self-delivery transit for "${donation.title}"`,
      category: 'Delivery'
    });
    // Audit log save karna
    await newLog.save();

    // Success response return karna
    res.status(200).json(donation);
  } catch (error) {
    // Error ko console me print karna
    console.error('startSelfTransit Error:', error);
    // Internal Server Error response bhejna
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Donor dwara khud delivery (self-delivery) complete mark karne wala controller
exports.completeSelfDelivery = async (req, res) => {
  try {
    // Agar MongoDB connected nahi hai to fallback database use hoga
    if (!global.isDbConnected) {
      // Fallback DB se donation check karna
      const donation = fallbackDb.findDonationById(req.params.id);
      // Agar donation nahi mili to error return karna
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }
      // Status ko Delivered mark karna
      const updates = {
        status: 'Delivered'
      };
      // Fallback DB me status update karna
      fallbackDb.updateDonation(req.params.id, updates);
      // Delivery log save karna
      fallbackDb.saveLog(`Self-delivery completed for "${donation.title}" by Donor`, 'Delivery');
      // Updated donation return karna
      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    // MongoDB se donation fetch karna
    const donation = await Donation.findById(req.params.id);
    // Agar donation nahi mili to error return karna
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    // Status ko Delivered update karna
    donation.status = 'Delivered';
    // Database me changes save karna
    await donation.save();

    // Audit log object create karna
    const newLog = new AuditLog({
      event: `Self-delivery completed for "${donation.title}" by Donor`,
      category: 'Delivery'
    });
    // Log save karna database me
    await newLog.save();

    // Success response return karna
    res.status(200).json(donation);
  } catch (error) {
    // Error ko console me print karna
    console.error('completeSelfDelivery Error:', error);
    // Internal Server Error response bhejna
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// OTP verify karke delivery/drop-off confirm karne wala controller
exports.verifyDeliveryOtp = async (req, res) => {
  try {
    const { otp, volunteerName } = req.body;
    if (!otp) {
      return res.status(400).json({ error: 'Verification OTP is required.' });
    }

    // Fallback DB
    if (!global.isDbConnected) {
      const donation = fallbackDb.findDonationById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }

      if (donation.deliveryOtp !== otp) {
        return res.status(400).json({ error: 'Incorrect delivery verification OTP. Please verify with the NGO.' });
      }

      const isSelf = donation.deliveryMode === 'Self';
      const courierName = isSelf ? 'Donor' : (volunteerName || 'Volunteer');

      const updates = {
        status: 'Delivered',
        courier: isSelf ? 'Self (Completed)' : `${courierName} (Completed)`
      };
      fallbackDb.updateDonation(req.params.id, updates);
      fallbackDb.saveLog(`Delivery verified & completed for "${donation.title}" by ${courierName}`, 'Delivery');

      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    // MongoDB
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    if (donation.deliveryOtp !== otp) {
      return res.status(400).json({ error: 'Incorrect delivery verification OTP. Please verify with the NGO.' });
    }

    const isSelf = donation.deliveryMode === 'Self';
    const courierName = isSelf ? 'Donor' : (volunteerName || 'Volunteer');

    donation.status = 'Delivered';
    donation.courier = isSelf ? 'Self (Completed)' : `${courierName} (Completed)`;
    await donation.save();

    const newLog = new AuditLog({
      event: `Delivery verified & completed for "${donation.title}" by ${courierName}`,
      category: 'Delivery'
    });
    await newLog.save();

    res.status(200).json(donation);
  } catch (error) {
    console.error('verifyDeliveryOtp Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
