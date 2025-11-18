// middleware/session.js
const sessionService = require('../services/sessionService');
const { error } = require('../utils/response');

async function sessionMiddleware(req, res, next) {
  try {
    const sid = req.cookies?.sid;
    if (!sid) return next();

    const sess = await sessionService.getSession(sid);
    if (!sess) return error(res, 'Session expired', 401);

    // attach minimal session
    req.user = {
      user_id: sess.user_id,
      email: sess.email,
      status: sess.status,
      is_superuser: sess.is_superuser || false,
      tenant_ids: sess.tenant_ids || [],
      memberships: sess.memberships || [],
      roles: sess.roles || [],
      client_accounts: sess.client_accounts || [],
      client_grants: sess.client_grants || [],
      active_tenant: sess.active_tenant || null,
      sid
    };

    return next();
  } catch (err) {
    console.error('Session middleware error:', err);
    return error(res, 'Authentication error', 500);
  }
}

module.exports = sessionMiddleware;
