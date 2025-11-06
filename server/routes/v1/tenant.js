const express = require('express');
const router = express.Router();

const tenantController = require('../../controllers/tenantController');
const session = require('../../middleware/session');
const requireAuth = require('../../middleware/requireAuth');
const requireSuperuser = require('../../middleware/requireSuperuser');

// Tenant onboarding — only for superusers
router.post('/onboard', session, requireAuth, requireSuperuser, tenantController.onboardTenant);

module.exports = router;
