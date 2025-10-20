const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const sessionService = require('./sessionService');

/**
 * Login with email + password.
 * Hydrates memberships, builds session payload (is_superuser, tenant_ids, roles).
 */
async function login(email, password, { activeTenant = null } = {}) {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.status !== 'active') {
    // Still disabled (e.g., hasn’t accepted invite)
    throw new Error('Account is disabled');
  }

  const ok = await bcrypt.compare(password, user.password_digest);
  if (!ok) {
    throw new Error('Invalid credentials');
  }

  const memberships = await userModel.getMemberships(user.user_id);

  const { sid, session } = await sessionService.createSession(user, memberships, activeTenant);

  return { sid, user: session };
}

/**
 * Logout by sid
 */
async function logout(sid) {
  if (sid) {
    await sessionService.destroySession(sid);
  }
}

module.exports = {
  login,
  logout,
};
