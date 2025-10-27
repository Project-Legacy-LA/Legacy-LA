const membershipModel = require('../models/membershipModel');
const clientModel = require('../models/clientModel');
const userService = require('../services/userService');
const { createInviteToken } = require('../utils/tokens');
const { success, error } = require('../utils/response');

/**
 * Invite an Attorney (Admin-only)
 */
async function inviteAttorney(req, res) {
  const { email } = req.body;
  const tenantId = req.user?.active_tenant;

  if (!email) {
    return error(res, 'Email is required', 400);
  }

  if (!tenantId) {
    return error(res, 'Active tenant context required', 400);
  }

  try {
    const { user } = await userService.createInvitedUser(email);

    await membershipModel.createMembership({
      tenantId,
      userId: user.user_id,
      role: 'attorney_owner',
      isActive: false,
    });

    const token = await createInviteToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      role: 'attorney_owner',
    });

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
  const tenantId = req.user?.active_tenant;

  if (!email || !clientId) {
    return error(res, 'Email and clientId required', 400);
  }

  if (!tenantId) {
    return error(res, 'Active tenant context required', 400);
  }

  try {
    const { user } = await userService.createInvitedUser(email);

    await clientModel.createClientAccount({
      tenantId,
      clientId,
      userId: user.user_id,
      role: 'owner',
      isEnabled: false,
    });

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
  const tenantId = req.user?.active_tenant;

  if (!email || !clientId || !role) {
    return error(res, 'Email, clientId, and role required', 400);
  }

  if (!tenantId) {
    return error(res, 'Active tenant context required', 400);
  }

  if (!['spouse', 'delegate'].includes(role)) {
    return error(res, 'Invalid role for delegate', 400);
  }

  try {
    const { user } = await userService.createInvitedUser(email);

    await clientModel.createClientAccount({
      tenantId,
      clientId,
      userId: user.user_id,
      role,
      isEnabled: false,
    });

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
