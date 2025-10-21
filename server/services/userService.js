const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const TEMP_PASSWORD_LENGTH = 12;

function generateTempPassword(length = TEMP_PASSWORD_LENGTH) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let temp = '';
  for (let i = 0; i < length; i++) {
    temp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return temp;
}

/**
 * Create invited user (status=disabled) with temporary password
 */
async function createInvitedUser(email, { personId = null, isSuperuser = false } = {}) {
  const tempPassword = generateTempPassword();
  const passwordDigest = await bcrypt.hash(tempPassword, 10);

  const user = await userModel.createUser({
    email,
    passwordDigest,
    status: 'disabled',
    personId,
    isSuperuser,
  });

  return { user, tempPassword };
}

/**
 * Activate user on invite acceptance: set chosen password + status=active
 */
async function activateUser(userId, newPassword) {
  const passwordDigest = await bcrypt.hash(newPassword, 10);
  const user = await userModel.activateUser(userId, passwordDigest);
  if (!user) throw new Error('User not found');
  return user;
}

/**
 * Toggle superuser flag on a user (true/false)
 */
async function setSuperuser(userId, value) {
  const user = await userModel.setSuperuser(userId, !!value);
  if (!user) throw new Error('User not found');
  return user;
}

module.exports = {
  generateTempPassword,
  createInvitedUser,
  activateUser,
  setSuperuser,
};
