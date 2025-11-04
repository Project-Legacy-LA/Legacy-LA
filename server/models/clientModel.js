const pool = require('../config/db');

/**
 * Insert a new client row.
 */
async function createClient({
  tenantId,
  primaryAttorneyUserId,
  label,
  relationshipStatus,
  residenceCountry,
  residenceAdminArea,
  residenceLocality,
  residencePostalCode = null,
  residenceLine1 = null,
  residenceLine2 = null,
}, db = pool) {
  const { rows } = await db.query(
    `
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
      RETURNING client_id, tenant_id, primary_attorney_user_id, label, status, relationship_status, created_at
    `,
    [
      tenantId,
      primaryAttorneyUserId,
      label,
      relationshipStatus,
      residenceCountry,
      residenceAdminArea,
      residenceLocality,
      residencePostalCode,
      residenceLine1,
      residenceLine2,
    ]
  );

  return rows[0];
}

/**
 * Link a user to a client account.
 */
async function createClientAccount({ tenantId, clientId, userId, role, isEnabled = false }, db = pool) {
  const { rows } = await db.query(
    `
      INSERT INTO app.client_account (tenant_id, client_id, user_id, role, is_enabled)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING client_account_id, tenant_id, client_id, user_id, role, is_enabled, created_at
    `,
    [tenantId, clientId, userId, role, isEnabled]
  );

  return rows[0];
}

/**
 * Load client details used by permission checks.
 */
async function getClientById(clientId) {
  const { rows } = await pool.query(
    `
      SELECT client_id,
             tenant_id::text,
             primary_attorney_user_id::text,
             label,
             residence_country,
             residence_admin_area,
             residence_locality,
             residence_postal_code,
             residence_line1,
             residence_line2,
             editing_frozen
        FROM app.client
       WHERE client_id = $1
       LIMIT 1
    `,
    [clientId]
  );

  return rows[0] || null;
}

async function findPrimaryClientForUser(userId) {
  const { rows } = await pool.query(
    `
      SELECT c.client_id,
             c.tenant_id::text,
             c.primary_attorney_user_id::text,
             c.label,
             c.residence_country,
             c.residence_admin_area,
             c.residence_locality,
             c.residence_postal_code,
             c.residence_line1,
             c.residence_line2,
             c.editing_frozen
        FROM app.client_account ca
        JOIN app.client c ON c.client_id = ca.client_id
       WHERE ca.user_id = $1
         AND ca.role = 'owner'
         AND ca.is_enabled = true
       LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
}

async function updateClientResidence(clientId, {
  residenceCountry,
  residenceAdminArea,
  residenceLocality,
  residencePostalCode = null,
  residenceLine1 = null,
  residenceLine2 = null,
}) {
  const { rows } = await pool.query(
    `
      UPDATE app.client
         SET residence_country = $2,
             residence_admin_area = $3,
             residence_locality = $4,
             residence_postal_code = $5,
             residence_line1 = $6,
             residence_line2 = $7,
             updated_at = now()
       WHERE client_id = $1
      RETURNING client_id,
                tenant_id::text,
                primary_attorney_user_id::text,
                label,
                residence_country,
                residence_admin_area,
                residence_locality,
                residence_postal_code,
                residence_line1,
                residence_line2,
                editing_frozen
    `,
    [clientId, residenceCountry, residenceAdminArea, residenceLocality, residencePostalCode, residenceLine1, residenceLine2]
  );

  return rows[0] || null;
}

/**
 * Get a client account membership for a specific user and client pair.
 */
async function getClientAccount(userId, clientId) {
  const { rows } = await pool.query(
    `
      SELECT client_account_id, role, is_enabled
        FROM app.client_account
       WHERE user_id = $1
         AND client_id = $2
       LIMIT 1
    `,
    [userId, clientId]
  );

  return rows[0] || null;
}

module.exports = {
  createClient,
  createClientAccount,
  getClientById,
  getClientAccount,
};
