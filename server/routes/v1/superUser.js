// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/sperUserController');

// Bootstrap-only: create a superuser (protected by ADMIN_SECRET header)
router.post('/superuser', userController.createSuperuser);

module.exports = router;
