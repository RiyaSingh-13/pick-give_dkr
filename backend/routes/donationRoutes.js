// backend/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, donationController.createDonation);
router.get('/', donationController.getDonations);
router.put('/:id/accept', authMiddleware, donationController.acceptDonation);
router.put('/:id/claim', authMiddleware, donationController.claimDonationRun);
router.put('/:id/verify-pickup', authMiddleware, donationController.verifyPickup);
router.put('/:id/complete', authMiddleware, donationController.completeDonationDelivery);
router.put('/:id/self-transit', authMiddleware, donationController.startSelfTransit);
router.put('/:id/self-complete', authMiddleware, donationController.completeSelfDelivery);

module.exports = router;
