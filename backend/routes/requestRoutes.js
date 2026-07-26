// backend/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, requestController.createRequest);
router.get('/', requestController.getRequests);
router.put('/:id/stop', authMiddleware, requestController.stopRequest);

module.exports = router;
