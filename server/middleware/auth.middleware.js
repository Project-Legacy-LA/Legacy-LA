const authService = require('../services/auth.service');
const ResponseUtil = require('../utils/response.util');

const authMiddleware = async (req, res, next) => {
  try {
    const sid = req.cookies?.sid;
    if (!sid) return ResponseUtil.unauthorized(res, 'No session');

    const session = await authService.updateSessionActivity(sid);
    if (!session) return ResponseUtil.unauthorized(res, 'Session expired');

    req.user = { user_id: session.user_id, email: session.email };
    req.session = { sid, ...session };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
