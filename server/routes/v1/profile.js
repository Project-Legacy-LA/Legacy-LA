const express = require('express');
const router = express.Router();

const session = require('../../middleware/session');
const requireAuth = require('../../middleware/requireAuth');
const profileController = require('../../controllers/profileController');

router.use(session, requireAuth);

router.get('/me', profileController.getProfile);
router.put('/me', profileController.updateProfile);

module.exports = router;
