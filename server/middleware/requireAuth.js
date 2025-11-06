const { error } = require('../utils/response');

function requireAuth(req, res, next) {
  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }

  if (req.user.status && req.user.status !== 'active') {
    return error(res, 'Account is disabled', 403);
  }

  return next();
}

module.exports = requireAuth;
