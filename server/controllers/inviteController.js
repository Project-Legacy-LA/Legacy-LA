const pool = require('../config/db');
const userService = require('../services/userService');
const { createInviteToken, deleteInviteToken } = require('../utils/tokens');
const { success, error } = require('../utils/response');

/**
 * Invite an Attorney (Admin-only)
 */
async function inviteAttorney(req, res) {
  const { email } = req.body;
  const tenantId = req.user?.tenant_id;

  if (!email) {
    return error(res, 'Email is required', 400);
  }

  try {
    // 1. Create disabled user
    const { user } = await userService.createInvitedUser(email);

    // 2. Link to tenant via membership
    await pool.query(
      `INSERT INTO app.membership (tenant_id, user_id, role, is_active)
       VALUES ($1, $2, 'attorney_owner', false)`,
      [tenantId, user.user_id]
    );

    // 3. Create invite token in Redis
    const token = await createInviteToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      role: 'attorney_owner',
    });

    // 4. Return invite link (in prod you’d email this)
    return success(res, { token, inviteLink: `/accept-invite?token=${token}` }, 'Attorney invited');
  } catch (err) {
    console.error('Invite attorney error:', err);
    return error(res, 'Failed to invite attorney', 500);
  }
}

/**
 * Invite a Client (Attorney-only)
 */
async function inviteClient(req, res) {
  const { email, clientId } = req.body;
  const tenantId = req.user?.tenant_id;

  if (!email || !clientId) {
    return error(res, 'Email and clientId required', 400);
  }

  try {
    const { user } = await userService.createInvitedUser(email);

    // Link user to client
    await pool.query(
      `INSERT INTO app.client_account (tenant_id, client_id, user_id, role, is_enabled)
       VALUES ($1, $2, $3, 'owner', false)`,
      [tenantId, clientId, user.user_id]
    );

    const token = await createInviteToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      client_id: clientId,
      role: 'client_owner',
    });

    return success(res, { token, inviteLink: `/accept-invite?token=${token}` }, 'Client invited');
  } catch (err) {
    console.error('Invite client error:', err);
    return error(res, 'Failed to invite client', 500);
  }
}

/**
 * Invite a Delegate (Client-only)
 */
async function inviteDelegate(req, res) {
  const { email, clientId, role } = req.body;
  const tenantId = req.user?.tenant_id;

  if (!email || !clientId || !role) {
    return error(res, 'Email, clientId, and role required', 400);
  }

  if (!['spouse', 'delegate'].includes(role)) {
    return error(res, 'Invalid role for delegate', 400);
  }

  try {
    const { user } = await userService.createInvitedUser(email);

    // Link user to client
    await pool.query(
      `INSERT INTO app.client_account (tenant_id, client_id, user_id, role, is_enabled)
       VALUES ($1, $2, $3, $4, false)`,
      [tenantId, clientId, user.user_id, role]
    );

    const token = await createInviteToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      client_id: clientId,
      role,
    });

    return success(res, { token, inviteLink: `/accept-invite?token=${token}` }, 'Delegate invited');
  } catch (err) {
    console.error('Invite delegate error:', err);
    return error(res, 'Failed to invite delegate', 500);
  }
}

module.exports = {
  inviteAttorney,
  inviteClient,
  inviteDelegate,
};
