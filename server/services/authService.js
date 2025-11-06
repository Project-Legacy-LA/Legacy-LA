const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const sessionService = require('./sessionService');

/**
 * Login with email + password.
 * Hydrates memberships and client grants, builds session payload.
 */
async function login(email, password, { activeTenant = null } = {}) {
  const user = await userModel.findByEmail(email);
  console.log(user)
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new Error('Account is disabled');
  }

  const ok = await bcrypt.compare(password, user.password_digest);
  if (!ok) {
    throw new Error('Invalid credentials');
  }

  // fetch tenant memberships (could be empty)
  const memberships = await userModel.getMemberships(user.user_id);

  // fetch explicit client grants (could be empty) — people granted by clients
  const clientGrants = await userModel.getClientGrants(user.user_id);

  const clientAccounts = await userModel.getClientAccounts(user.user_id);

  const { sid, session } = await sessionService.createSession(
    user,
    memberships,
    clientGrants,
    clientAccounts,
    activeTenant
  );

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
