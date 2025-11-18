const { error } = require('../utils/response');

function requireTenantRole(...roles) {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Not authenticated', 401);
    }

    if (req.user.is_superuser) {
      return next();
    }

    const activeTenant = req.user.active_tenant;
    if (!activeTenant) {
      return error(res, 'Active tenant context required', 400);
    }

    const memberships = req.user.memberships || [];
    const membership = memberships.find(m => m.tenant_id === activeTenant);

    if (!membership) {
      return error(res, 'Forbidden: no membership for active tenant', 403);
    }

    if (!allowedRoles.includes(membership.role)) {
      return error(res, 'Forbidden: insufficient role', 403);
    }

    return next();
  };
}

module.exports = requireTenantRole;
