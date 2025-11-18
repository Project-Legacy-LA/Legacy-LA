const express = require('express');
const router = express.Router();

const clientController = require('../../controllers/clientController');
const session = require('../../middleware/session');
const requireClientPermission = require('../../middleware/requireClientPermission');
const requireAuth = require('../../middleware/requireAuth');
const requireTenantRole = require('../../middleware/requireTenantRole');

// Create client (attorney-owner only in active tenant)
router.post('/', session, requireAuth, requireTenantRole('attorney_owner'), clientController.createClient);

//read client (requires read)

//router.get('/:client_id', session, requireClientPermission('read'), clientController.getClient);

// update client (requires write)
//router.put('/:client_id', session, requireClientPermission('write'), clientController.updateClient);

// delete client (requires delete)
//router.delete('/:client_id', session, requireClientPermission('delete'), clientController.deleteClient);


module.exports = router;
