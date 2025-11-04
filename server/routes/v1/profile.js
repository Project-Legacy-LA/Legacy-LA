const express = require('express');
const router = express.Router();

const session = require('../../middleware/session');
const profileController = require('../../controllers/profileController');

router.use(session);

router.get('/me', profileController.getProfile);
router.put('/me', profileController.updateProfile);

module.exports = router;
