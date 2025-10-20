const express = require('express');
const router = express.Router();

const clientController = require('../../controllers/clientController');
const session = require('../../middleware/session');

// Create client (attorney-owner only in active tenant)
router.post('/', session, clientController.createClient);

module.exports = router;
