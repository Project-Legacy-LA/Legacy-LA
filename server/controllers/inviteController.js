const inviteService = require('../services/inviteService');
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
    const { token } = await inviteService.inviteAttorney({ email, tenantId });

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
    const { token } = await inviteService.inviteClient({ email, tenantId, clientId });

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
    const { token } = await inviteService.inviteDelegate({ email, tenantId, clientId, role });

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
