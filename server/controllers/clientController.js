const pool = require('../config/db');
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
    // insert into client
    const query = `
      INSERT INTO app.client (
        tenant_id,
        primary_attorney_user_id,
        label,
        status,
        relationship_status,
        residence_country,
        residence_admin_area,
        residence_locality,
        residence_postal_code,
        residence_line1,
        residence_line2
      )
      VALUES (
        $1, $2, $3,
        'active', $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING client_id, label, status, relationship_status, created_at
    `;

    const values = [
      actor.tenant_id,
      actor.user_id, // attorney is set as primary_attorney_user_id
      label,
      relationship_status,
      residence_country,
      residence_admin_area,
      residence_locality,
      residence_postal_code || null,
      residence_line1 || null,
      residence_line2 || null
    ];

    const { rows } = await pool.query(query, values);
    const client = rows[0];

    return success(res, { client }, 'Client created successfully');
  } catch (err) {
    console.error('Create client error:', err);
    return error(res, 'Failed to create client', 500);
  }
}

module.exports = {
  createClient
};
