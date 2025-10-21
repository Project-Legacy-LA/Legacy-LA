const express = require('express');
const router = express.Router();

const authController = require('../../controllers/authController');

// Auth routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.me);
router.post('/accept-invite', authController.acceptInvite);

module.exports = router;
