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
async function createSession(
  user,
  memberships = [],
  clientGrants = [],
  clientAccounts = [],
  activeTenant = null
) {
  const sid = uuidv4();

  const tenantIds = memberships.map(m => m.tenant_id);
  // also include tenant ids derived from client grants (unique)
  const grantTenantIds = [...new Set(clientGrants.map(g => g.tenant_id))];
  const enabledAccounts = clientAccounts.filter(account => account.is_enabled);
  const accountTenantIds = [...new Set(enabledAccounts.map(a => a.tenant_id))];
  const allTenantIds = [...new Set([...tenantIds, ...grantTenantIds, ...accountTenantIds])];

  const roles = memberships.map(m => m.role);

  let resolvedActiveTenant = activeTenant;
  if (resolvedActiveTenant && !allTenantIds.includes(resolvedActiveTenant)) {
    resolvedActiveTenant = null;
  }

  if (!resolvedActiveTenant) {
    resolvedActiveTenant = tenantIds[0] || accountTenantIds[0] || grantTenantIds[0] || null;
  }

  const sessionData = {
    user_id: user.user_id,
    email: user.email,
    status: user.status,
    is_superuser: !!user.is_superuser,
    memberships,
    tenant_ids: allTenantIds,
    roles, // may be []
    client_accounts: clientAccounts,
    client_grants: clientGrants, // full grant objects for UI/logic
    active_tenant: resolvedActiveTenant,
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
