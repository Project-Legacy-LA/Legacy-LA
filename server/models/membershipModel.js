const pool = require('../config/db');

/**
 * Create a membership link between a tenant and a user.
 */
async function createMembership({ tenantId, userId, role, isActive = false }) {
  const { rows } = await pool.query(
    `
      INSERT INTO app.membership (tenant_id, user_id, role, is_active)
      VALUES ($1, $2, $3, $4)
    `,
    [tenantId, userId, role, isActive]
  );

  return rows[0];
}

/**
 * Activate a specific membership row.
 */
async function activateMembership({ tenantId, userId, role }) {
  const { rows } = await pool.query(
    `
      UPDATE app.membership
         SET is_active = true, updated_at = now()
       WHERE tenant_id = $1
         AND user_id = $2
         AND role = $3 
         `,
    [tenantId, userId, role]
  );

  return rows[0];
}

module.exports = {
  createMembership,
  activateMembership,
};
