const authService = require('../services/authService');
const userService = require('../services/userService');
const { verifyInviteToken, deleteInviteToken } = require('../utils/tokens');
const { success, error } = require('../utils/response');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000, // 24h
};

async function login(req, res) {
  const { email, password } = req.body;
  const activeTenant = req.headers['x-tenant-id'] || null;

  if (!email || !password) {
    return error(res, 'Email and password required', 400);
  }

  try {
    const { sid, user } = await authService.login(email, password, { activeTenant });
    res.cookie('sid', sid, COOKIE_OPTIONS);
    return success(res, { user }, 'Login successful');
  } catch (err) {
    console.error('Login error:', err.message);
    return error(res, err.message === 'Account is disabled' ? 'Account is disabled' : 'Invalid credentials', 401);
  }
}

async function logout(req, res) {
  const sid = req.cookies.sid;
  if (!sid) {
    return error(res, 'No active session', 400);
  }

  try {
    await authService.logout(sid);
    res.clearCookie('sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return success(res, {}, 'Logout successful');
  } catch (err) {
    console.error('Logout error:', err.message);
    return error(res, 'Failed to logout', 500);
  }
}

async function me(req, res) {
  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }
  return success(res, { user: req.user }, 'Session active');
}

/**
 * Accept invite (no auto-login)
 */
async function acceptInvite(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return error(res, 'Token and password are required', 400);
  }

  try {
    const payload = await verifyInviteToken(token);
    if (!payload) {
      return error(res, 'Invite expired or invalid', 410);
    }

    const { user_id } = payload;

    // Activate account
    const user = await userService.activateUser(user_id, password);

    // Invalidate token
    await deleteInviteToken(token);

    return success(
      res,
      { user_id: user.user_id, email: user.email },
      'Invite accepted, account activated'
    );
  } catch (err) {
    console.error('Accept invite error:', err);
    return error(res, 'Failed to accept invite', 500);
  }
}

module.exports = {
  login,
  logout,
  me,
  acceptInvite,
};
