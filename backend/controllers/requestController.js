// backend/controllers/requestController.js
const Request = require('../models/Request');
const User = require('../models/User');
const fallbackDb = require('../config/fallbackDb');

// @desc    Post a new NGO Request/Requirement
// @route   POST /api/requests
// @access  Public (NGO)
exports.createRequest = async (req, res) => {
  try {
    const { title, category, urgency, quantity, description, ngo } = req.body;

    if (!title || !category || !quantity || !ngo) {
      return res.status(400).json({ error: 'Missing required request posting fields.' });
    }

    // Backend Safety Lock: Verify that the requesting NGO is Approved
    if (!global.isDbConnected) {
      const allUsers = fallbackDb.getUsers();
      const matchedNgo = allUsers.find(u => u.role === 'NGO' && u.ngoName === ngo);
      if (matchedNgo && matchedNgo.status !== 'Approved') {
        return res.status(403).json({ 
          error: `Your NGO profile status is currently "${matchedNgo ? matchedNgo.status : 'Pending'}". You cannot post requests until approved by the administrator.` 
        });
      }
    } else {
      const matchedNgo = await User.findOne({ role: 'NGO', ngoName: ngo });
      if (matchedNgo && matchedNgo.status !== 'Approved') {
        return res.status(403).json({ 
          error: `Your NGO profile status is currently "${matchedNgo ? matchedNgo.status : 'Pending'}". You cannot post requests until approved by the administrator.` 
        });
      }
    }

    if (!global.isDbConnected) {
      const newRequest = fallbackDb.saveRequest(req.body);
      return res.status(201).json(newRequest);
    }

    const newRequest = new Request({
      title,
      category,
      urgency,
      quantity,
      description,
      ngo
    });

    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('createRequest Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get all NGO Requests
// @route   GET /api/requests
// @access  Public
exports.getRequests = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const requests = fallbackDb.getRequests();
      return res.status(200).json(requests);
    }

    const requests = await Request.find().sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error('getRequests Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Stop/Close an NGO Request
// @route   PUT /api/requests/:id/stop
// @access  Public (NGO)
exports.stopRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!global.isDbConnected) {
      const updated = fallbackDb.updateRequest(id, { status: 'Stopped' });
      if (!updated) {
        return res.status(404).json({ error: 'Request not found.' });
      }
      return res.status(200).json(updated);
    }

    const updated = await Request.findByIdAndUpdate(id, { status: 'Stopped' }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('stopRequest Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
