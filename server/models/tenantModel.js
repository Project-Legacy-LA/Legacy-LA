const pool = require('../config/db');

/**
 * Insert a tenant row linked to the owner attorney.
 */
async function createTenant({ ownerUserId, displayName }) {
  const { rows } = await pool.query(
    `
      INSERT INTO app.tenant (owner_user_id, display_name)
      VALUES ($1, $2)
      RETURNING tenant_id, owner_user_id, display_name, created_at
    `,
    [ownerUserId, displayName]
  );

  return rows[0];
}

module.exports = {
  createTenant,
};
