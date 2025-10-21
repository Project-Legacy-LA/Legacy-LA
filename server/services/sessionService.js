const { v4: uuidv4 } = require('uuid');
const redis = require('../config/redis');

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 60 * 60 * 24; // 24h

/**
 * Create a session with memberships + client_grants.
 * @param {Object} user         user row from DB
 * @param {Array} memberships   [{ tenant_id, role }, ...]
 * @param {Array} clientGrants  [{ client_grant_id, tenant_id, client_id, permissions }, ...]
 * @param {string|null} activeTenant optional tenant to pin as active
 */
async function createSession(user, memberships = [], clientGrants = [], activeTenant = null) {
  const sid = uuidv4();

  const tenantIds = memberships.map(m => m.tenant_id);
  // also include tenant ids derived from client grants (unique)
  const grantTenantIds = [...new Set(clientGrants.map(g => g.tenant_id))];
  const allTenantIds = [...new Set([...tenantIds, ...grantTenantIds])];

  const roles = memberships.map(m => m.role);

  const sessionData = {
    user_id: user.user_id,
    email: user.email,
    is_superuser: !!user.is_superuser,
    tenant_ids: allTenantIds,
    roles, // may be []
    client_grants: clientGrants, // full grant objects for UI/logic
    active_tenant: activeTenant || allTenantIds[0] || null,
    created_at: new Date().toISOString(),
  };
  console.log(JSON.stringify(sessionData))

  await redis.setex(SESSION_PREFIX + sid, SESSION_TTL, JSON.stringify(sessionData));
  return { sid, session: sessionData };
}

async function getSession(sid) {
  const data = await redis.get(SESSION_PREFIX + sid);
  return data ? JSON.parse(data) : null;
}

async function destroySession(sid) {
  await redis.del(SESSION_PREFIX + sid);
}

async function touchSession(sid) {
  const key = SESSION_PREFIX + sid;
  const data = await redis.get(key);
  if (data) {
    await redis.setex(key, SESSION_TTL, data);
  }
}

module.exports = {
  createSession,
  getSession,
  destroySession,
  touchSession,
};
