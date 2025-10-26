const clientService = require('../services/clientService');
const { success, error } = require('../utils/response');

/**
 * Create a new client
 * @route POST /api/v1/client
 * @body { label, relationship_status, residence_country, residence_admin_area, residence_locality, ... }
 */
async function createClient(req, res) {
  const actor = req.user; // set by session middleware
  if (!actor) {
    return error(res, 'Not authenticated', 401);
  }

  const tenantId = actor.active_tenant;
  if (!tenantId) {
    return error(res, 'Active tenant context required', 400);
  }

  const {
    label,
    relationship_status,
    residence_country,
    residence_admin_area,
    residence_locality,
    residence_postal_code,
    residence_line1,
    residence_line2
  } = req.body;

  if (!label || !relationship_status || !residence_country || !residence_admin_area || !residence_locality) {
    return error(res, 'Missing required fields', 400);
  }

  try {
    const client = await clientService.createClient({
      tenantId,
      primaryAttorneyUserId: actor.user_id,
      label,
      relationshipStatus: relationship_status,
      residenceCountry: residence_country,
      residenceAdminArea: residence_admin_area,
      residenceLocality: residence_locality,
      residencePostalCode: residence_postal_code || null,
      residenceLine1: residence_line1 || null,
      residenceLine2: residence_line2 || null,
    });

    return success(res, { client }, 'Client created successfully');
  } catch (err) {
    console.error('Create client error:', err);
    return error(res, 'Failed to create client', 500);
  }
}

module.exports = {
  createClient
};
