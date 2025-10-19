const authService = require('../services/auth.service');
const ResponseUtil = require('../utils/response.util');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 1000 * 60 * 60 * 24 // 24h
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) return ResponseUtil.error(res, 'Email already registered');

    const newUser = await authService.createUser(email, password);
    const { sid } = await authService.createSession(newUser, req.ip, req.headers['user-agent']);

    res.cookie('sid', sid, cookieOptions);
    return ResponseUtil.created(res, { user: newUser }, 'User registered');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) return ResponseUtil.unauthorized(res, 'Invalid credentials');
    if (user.status !== 'active') return ResponseUtil.forbidden(res, 'Account disabled');

    const valid = await authService.comparePasswords(password, user.password_digest);
    if (!valid) return ResponseUtil.unauthorized(res, 'Invalid credentials');

    delete user.password_digest;

    const { sid } = await authService.createSession(user, req.ip, req.headers['user-agent']);
    res.cookie('sid', sid, cookieOptions);

    return ResponseUtil.success(res, { user }, 'Logged in');
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.findUserById(req.user.user_id);
    if (!user) return ResponseUtil.notFound(res, 'User not found');
    return ResponseUtil.success(res, { user });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const sid = req.cookies?.sid;
    if (sid && req.user) {
      await authService.destroySession(sid, req.user.user_id);
    }
    res.clearCookie('sid', cookieOptions);
    return ResponseUtil.success(res, {}, 'Logged out');
  } catch (err) {
    next(err);
  }
};

const listSessions = async (req, res, next) => {
  try {
    const sessions = await authService.listUserSessions(req.user.user_id);

    // transform timestamps into friendlier values
    const formatted = sessions.map(s => ({
      sid: s.sid,
      device: `${s.device.browser} on ${s.device.os} (${s.device.device})`,
      location: `${s.location.city}, ${s.location.country}`,
      created_at: new Date(s.created_at).toLocaleString(),
      last_seen: new Date(s.last_seen).toLocaleString()
    }));

    return ResponseUtil.success(res, { sessions: formatted });
  } catch (err) {
    next(err);
  }
};


const logoutSession = async (req, res, next) => {
  try {
    const { sid } = req.params; // session id to revoke
    const success = await authService.destroyUserSession(req.user.user_id, sid);
    if (!success) return ResponseUtil.notFound(res, 'Session not found');
    return ResponseUtil.success(res, {}, 'Session revoked');
  } catch (err) {
    next(err);
  }
};

const logoutAllSessions = async (req, res, next) => {
  try {
    await authService.destroyAllSessions(req.user.user_id);
    return ResponseUtil.success(res, {}, 'All sessions revoked');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  listSessions,
  logoutSession,
  logoutAllSessions
};
