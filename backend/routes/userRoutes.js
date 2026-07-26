// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/verify-email', userController.verifyEmail);
router.get('/members', userController.getMembers);
router.get('/ngos', userController.getNgos);
router.put('/ngos/:id/verify', userController.verifyNgo);
router.delete('/:id', userController.deleteUser);

module.exports = router;
