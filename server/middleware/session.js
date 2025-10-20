const pool = require('../config/db');
const { error } = require('../utils/response');
const sessionService = require('../services/sessionService');

/**
 * Loads session from Redis, attaches req.user,
 * and sets Postgres session actor via app.set_actor(user_id, tenant_id).
 *
 * Tenant selection order:
 *  - X-Tenant-Id header (explicit)
 *  - session.active_tenant
 *  - first session.tenant_ids[0]
 */
async function sessionMiddleware(req, res, next) {
  try {
    const sid = req.cookies.sid;
    if (!sid) return next(); // allow public routes to pass

    const sess = await sessionService.getSession(sid);
    if (!sess) return error(res, 'Session expired', 401);

    req.user = {
      user_id: sess.user_id,
      email: sess.email,
      is_superuser: sess.is_superuser,
      tenant_ids: sess.tenant_ids || [],
      roles: sess.roles || [],
      active_tenant: sess.active_tenant || null,
      sid,
    };

    // Choose tenant for this request
    const headerTenant = req.headers['x-tenant-id'];
    const tenantId =
      (typeof headerTenant === 'string' && headerTenant) ||
      req.user.active_tenant ||
      req.user.tenant_ids?.[0] ||
      null;

    // If we have a tenant, set the DB actor for RLS
    if (tenantId) {
      await pool.query('SELECT app.set_actor($1, $2)', [req.user.user_id, tenantId]);
      req.user.active_tenant = tenantId;
    } else {
      // We still set user_id in actor if you want (but your helper takes both);
      // If you need user-only, you could add a set_actor_user() helper. For now, skip.
    }

    return next();
  } catch (err) {
    console.error('Session middleware error:', err);
    return error(res, 'Authentication error', 500);
  }
}

module.exports = sessionMiddleware;
