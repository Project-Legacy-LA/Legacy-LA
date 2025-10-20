const { error } = require('../utils/response');

function requireSuperuser(req, res, next) {
  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }
  if (!req.user.is_superuser) {
    return error(res, 'Forbidden: superuser only', 403);
  }
  return next();
}

module.exports = requireSuperuser;
