const express = require('express');
const router = express.Router();

const tenantController = require('../../controllers/tenantController');
const session = require('../../middleware/session');
const requireSuperuser = require('../../middleware/requireSuperuser');

// Tenant onboarding — only for superusers
router.post('/onboard', session, requireSuperuser, tenantController.onboardTenant);

module.exports = router;
