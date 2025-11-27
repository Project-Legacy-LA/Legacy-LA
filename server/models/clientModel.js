const pool = require('../config/db');

/** ===== Helpers for safe, partial updates ===== **/

/** Which client columns are allowed to be edited (camelCase → snake_case). */
const ALLOWED_CLIENT_UPDATE_FIELDS = {
  label: 'label',
  status: 'status', // remove if status shouldn't be user-editable
  relationshipStatus: 'relationship_status',
  primaryAttorneyUserId: 'primary_attorney_user_id',
  residenceCountry: 'residence_country',
  residenceAdminArea: 'residence_admin_area',
  residenceLocality: 'residence_locality',
  residencePostalCode: 'residence_postal_code',
  residenceLine1: 'residence_line1',
  residenceLine2: 'residence_line2',
};

/** Which client_account columns are allowed to be edited (camelCase → snake_case). */
const ALLOWED_ACCOUNT_UPDATE_FIELDS = {
  role: 'role',
  canWrite: 'can_write',
  isEnabled: 'is_enabled',
};

/** Pick only allowed fields and convert keys to snake_case. Undefineds are ignored; nulls are kept. */
function projectFields(data, allowMap) {
  const out = {};
  for (const [camel, snake] of Object.entries(allowMap)) {
    if (Object.prototype.hasOwnProperty.call(data, camel) && data[camel] !== undefined) {
      out[snake] = data[camel];
    }
  }
  return out;
}

/** Build a parameterized SET clause from a key→value object. startIndex controls $N numbering. */
function buildUpdateSet(obj, startIndex = 1) {
  const keys = Object.keys(obj);
  const sets = keys.map((k, i) => `${k} = $${startIndex + i}`);
  const values = keys.map(k => obj[k]);
  return { sets, values };
}

/** ===== Create functions you already have ===== **/

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
  pathType = 'path1', // Default to path1 (Estate Planning)
}, db = pool) {
  // NOTE: pathType is stored in invite token for now. 
  // Backend developer: Add path_type column to client table and include it in INSERT below.
  // For now, pathType is passed to token creation in clientController.
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
        -- TODO: Add path_type column to table and include here:
        -- path_type
      )
      VALUES (
        $1, $2, $3,
        'active', $4, $5, $6, $7, $8, $9, $10
        -- TODO: Add pathType to values array when column exists:
        -- , $11
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
      // TODO: Add pathType to array when column exists:
      // pathType || 'path1',
    ]
  );
  return rows[0];
}

async function createClientAccount({ tenantId, clientId, userId, role, can_write = true, isEnabled = false }, db = pool) {
  // NOTE: fixed VALUES placeholders (6 columns → 6 params) and RETURNING to include can_write
  const { rows } = await db.query(
    `
      INSERT INTO app.client_account (tenant_id, client_id, user_id, role, can_write, is_enabled)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING client_account_id, tenant_id, client_id, user_id, role, can_write, is_enabled
    `,
    [tenantId, clientId, userId, role, can_write, isEnabled]
  );
  return rows[0];
}

async function getClientById(clientId) {
  const { rows } = await pool.query(
    `
      SELECT client_id,
             tenant_id::text,
             primary_attorney_user_id::text,
             label,
             status,
             relationship_status,
             residence_country,
             residence_admin_area,
             residence_locality,
             residence_postal_code,
             residence_line1,
             residence_line2,
             editing_frozen,
             updated_at
        FROM app.client
       WHERE client_id = $1
       LIMIT 1
    `,
    [clientId]
  );
  return rows[0] || null;
}

async function getClientAccount(userId, clientId) {
  const { rows } = await pool.query(
    `
      SELECT client_account_id, tenant_id, role, can_write, is_enabled, created_by_user_id
        FROM app.client_account
       WHERE user_id = $1
         AND client_id = $2
       LIMIT 1
    `,
    [userId, clientId]
  );
  return rows[0] || null;
}



/**
 * PATCH-style updater for app.client.
 * Only fields in ALLOWED_CLIENT_UPDATE_FIELDS are applied.
 * Options:
 *   - checkFrozen (default true): block update when editing_frozen = true
 *   - expectedUpdatedAt: optimistic concurrency (match updated_at)
 */
async function updateClient(
  clientId,
  data,
  { checkFrozen = true, expectedUpdatedAt = null } = {},
  db = pool
) {
  const fields = projectFields(data, ALLOWED_CLIENT_UPDATE_FIELDS);
  if (Object.keys(fields).length === 0) {
    // nothing to update; return current row for convenience
    return getClientById(clientId);
  }

  // always bump updated_at
  fields.updated_at = new Date();

  const { sets, values } = buildUpdateSet(fields, 2);
  const where = ['client_id = $1'];
  const params = [clientId, ...values];

  if (checkFrozen) where.push('editing_frozen = false');
  if (expectedUpdatedAt) {
    where.push(`updated_at = $${params.length + 1}`);
    params.push(new Date(expectedUpdatedAt));
  }

  const { rows } = await db.query(
    `
      UPDATE app.client
         SET ${sets.join(', ')}
       WHERE ${where.join(' AND ')}
      RETURNING client_id,
                tenant_id::text,
                primary_attorney_user_id::text,
                label,
                status,
                relationship_status,
                residence_country,
                residence_admin_area,
                residence_locality,
                residence_postal_code,
                residence_line1,
                residence_line2,
                editing_frozen,
                updated_at
    `,
    params
  );

  // null → not found, frozen, or optimistic lock failed
  return rows[0] || null;
}

/**
 * PATCH-style updater for app.client_account (by client_account_id).
 * Only fields in ALLOWED_ACCOUNT_UPDATE_FIELDS are applied.
 */
async function updateClientAccountById(
  clientAccountId,
  data,
  db = pool
) {
  const fields = projectFields(data, ALLOWED_ACCOUNT_UPDATE_FIELDS);
  if (Object.keys(fields).length === 0) {
    const { rows } = await db.query(
      `SELECT client_account_id, tenant_id, client_id, user_id, role, can_write, is_enabled
         FROM app.client_account
        WHERE client_account_id = $1
        LIMIT 1`,
      [clientAccountId]
    );
    return rows[0] || null;
  }

  const { sets, values } = buildUpdateSet(fields, 2);
  const { rows } = await db.query(
    `
      UPDATE app.client_account
         SET ${sets.join(', ')}
       WHERE client_account_id = $1
      RETURNING client_account_id, tenant_id, client_id, user_id, role, can_write, is_enabled
    `,
    [clientAccountId, ...values]
  );
  return rows[0] || null;
}

/**
 * Convenience updater for a (userId, clientId) pair.
 */
async function updateClientAccountForUser(
  { userId, clientId },
  data,
  db = pool
) {
  const fields = projectFields(data, ALLOWED_ACCOUNT_UPDATE_FIELDS);
  if (Object.keys(fields).length === 0) {
    const { rows } = await db.query(
      `SELECT client_account_id, tenant_id, client_id, user_id, role, can_write, is_enabled
         FROM app.client_account
        WHERE user_id = $1 AND client_id = $2
        LIMIT 1`,
      [userId, clientId]
    );
    return rows[0] || null;
  }

  const { sets, values } = buildUpdateSet(fields, 3);
  const { rows } = await db.query(
    `
      UPDATE app.client_account
         SET ${sets.join(', ')}
       WHERE user_id = $1 AND client_id = $2
      RETURNING client_account_id, tenant_id, client_id, user_id, role, can_write, is_enabled
    `,
    [userId, clientId, ...values]
  );
  return rows[0] || null;
}

module.exports = {
  createClient,
  createClientAccount,
  getClientById,
  getClientAccount,
  updateClient,                 
  updateClientAccountById,      
  updateClientAccountForUser,   
};
