const { v4: uuidv4 } = require('uuid');
const redis = require('../config/redis');

const INVITE_PREFIX = 'invite:';
const DEFAULT_TTL = 60 * 60 * 24; // 24 hours in seconds

/**
 * Create a new invite token in Redis
 * @param {Object} payload - data to store (user_id, tenant_id, role, client_id?)
 * @param {number} ttl - expiration in seconds (default = 24h)
 * @returns {string} token
 */
async function createInviteToken(payload, ttl = DEFAULT_TTL) {
  const token = uuidv4();

  await redis.setex(
    INVITE_PREFIX + token,
    ttl,
    JSON.stringify(payload)
  );

  return token;
}

/**
 * Verify token and return payload
 * @param {string} token
 * @returns {Object|null}
 */
async function verifyInviteToken(token) {
  const data = await redis.get(INVITE_PREFIX + token);
  return data ? JSON.parse(data) : null;
}

/**
 * Delete token (after use or cancellation)
 * @param {string} token
 */
async function deleteInviteToken(token) {
  await redis.del(INVITE_PREFIX + token);
}

module.exports = {
  createInviteToken,
  verifyInviteToken,
  deleteInviteToken,
};
