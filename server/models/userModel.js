const pool = require('../config/db');

/**
 * Find a user by email (includes is_superuser)
 */
async function findByEmail(email) {
  const { rows } = await pool.query(
    `
    SELECT user_id, email, password_digest, status, person_id, is_superuser, created_at, updated_at
    FROM app.users
    WHERE email = $1
    LIMIT 1
    `,
    [email]
  );
  return rows[0] || null;
}

/**
 * Find a user by ID (includes is_superuser)
 */
async function findById(userId) {
  const { rows } = await pool.query(
    `
    SELECT user_id, email, status, person_id, is_superuser, created_at, updated_at
    FROM app.users
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Create a new user (typically for invitations)
 */
async function createUser({ email, passwordDigest, status, personId = null, isSuperuser = false }) {
  const { rows } = await pool.query(
    `
    INSERT INTO app.users (email, password_digest, status, person_id, is_superuser)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, email, status, person_id, is_superuser, created_at, updated_at
    `,
    [email, passwordDigest, status, personId, isSuperuser]
  );
  return rows[0];
}

/**
 * Activate user + set password digest
 */
async function activateUser(userId, passwordDigest) {
  const { rows } = await pool.query(
    `
    UPDATE app.users
    SET password_digest = $2, status = 'active', updated_at = now()
    WHERE user_id = $1
    RETURNING user_id, email, status, person_id, is_superuser, updated_at
    `,
    [userId, passwordDigest]
  );
  return rows[0] || null;
}

/**
 * Update password only (keeps current status)
 */
async function updatePassword(userId, passwordDigest) {
  const { rows } = await pool.query(
    `
    UPDATE app.users
    SET password_digest = $2, updated_at = now()
    WHERE user_id = $1
    RETURNING user_id, email, status, person_id, is_superuser, updated_at
    `,
    [userId, passwordDigest]
  );
  return rows[0] || null;
}

/**
 * Toggle superuser flag
 */
async function setSuperuser(userId, isSuperuser) {
  const { rows } = await pool.query(
    `
    UPDATE app.users
    SET is_superuser = $2, updated_at = now()
    WHERE user_id = $1
    RETURNING user_id, email, status, person_id, is_superuser, updated_at
    `,
    [userId, !!isSuperuser]
  );
  return rows[0] || null;
}

/**
 * Get active memberships for a user (roles + tenant_ids)
 */
async function getMemberships(userId) {
  const { rows } = await pool.query(
    `
    SELECT tenant_id, role
    FROM app.membership
    WHERE user_id = $1
      AND is_active = true
    `,
    [userId]
  );
  return rows; // [{ tenant_id, role }, ...]
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  activateUser,
  updatePassword,
  setSuperuser,
  getMemberships,
};
