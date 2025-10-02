const { v4: uuidv4 } = require('uuid');
const redis = require('../config/redis');

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 60 * 60 * 24; // 24 hours in seconds

/**
 * Create a new session in Redis
 * @param {Object} user - user context (user_id, tenant_id, roles, scope)
 * @returns {string} sid - session id
 */
async function createSession(user) {
  const sid = uuidv4();

  const sessionData = {
    user_id: user.user_id,
    tenant_id: user.tenant_id,
    roles: user.roles || [],
    scope: user.scope || null,
    created_at: new Date().toISOString(),
  };

  await redis.setex(
    SESSION_PREFIX + sid,
    SESSION_TTL,
    JSON.stringify(sessionData)
  );

  return sid;
}

/**
 * Get session data from Redis
 * @param {string} sid
 * @returns {Object|null} session data
 */
async function getSession(sid) {
  const data = await redis.get(SESSION_PREFIX + sid);
  return data ? JSON.parse(data) : null;
}

/**
 * Destroy session (logout)
 * @param {string} sid
 */
async function destroySession(sid) {
  await redis.del(SESSION_PREFIX + sid);
}

module.exports = {
  createSession,
  getSession,
  destroySession,
};
