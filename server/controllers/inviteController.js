const membershipModel = require('../models/membershipModel');
const clientModel = require('../models/clientModel');
const userService = require('../services/userService');
const emailService = require('../services/emailService');
const { createInviteToken } = require('../utils/tokens');
const { buildAcceptInviteUrl, buildInviteEmail } = require('../utils/inviteEmail');
const { success, error } = require('../utils/response');

function isAttorneyOwner(req) {
  const memberships = req.user?.memberships || [];
  const activeTenant = req.user?.active_tenant;
  if (!activeTenant) return false;
  return memberships.some(m => m.tenant_id === activeTenant && m.role === 'attorney_owner');
}

/**
 * Invite an Attorney (Admin-only)
 */
async function inviteAttorney(req, res) {
  const { email } = req.body;
  const tenantId = req.user?.active_tenant;

  if (!email) {
    return error(res, 'Email is required', 400);
  }

  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }

  if (!tenantId) {
    return error(res, 'Active tenant context required', 400);
  }

  if (!req.user.is_superuser && !isAttorneyOwner(req)) {
    return error(res, 'Forbidden: attorney owners only', 403);
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

    const acceptUrl = buildAcceptInviteUrl(token);
    const { subject, text, html } = buildInviteEmail({
      inviteType: 'attorney_owner',
      inviterEmail: req.user?.email,
      acceptUrl,
    });

    await emailService.sendMail({
      to: email,
      subject,
      text,
      html,
      replyTo: req.user?.email,
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

  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }

  if (!isAttorneyOwner(req)) {
    return error(res, 'Forbidden: attorney owners only', 403);
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

    const acceptUrl = buildAcceptInviteUrl(token);
    const client = await clientModel.getClientById(clientId);
    const { subject, text, html } = buildInviteEmail({
      inviteType: 'client_owner',
      inviterEmail: req.user?.email,
      acceptUrl,
      context: {
        clientLabel: client?.label || 'a client workspace',
      },
    });

    await emailService.sendMail({
      to: email,
      subject,
      text,
      html,
      replyTo: req.user?.email,
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

  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }

  if (role !== 'spouse') {
    return error(res, 'Invalid role for delegate', 400);
  }

  const accounts = req.user.client_accounts || [];
  const ownsClient = accounts.some(account => account.client_id === String(clientId) && account.role === 'owner' && account.is_enabled);

  if (!ownsClient) {
    return error(res, 'Forbidden: only the client owner can invite a spouse', 403);
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

    const acceptUrl = buildAcceptInviteUrl(token);
    const client = await clientModel.getClientById(clientId);
    const { subject, text, html } = buildInviteEmail({
      inviteType: role,
      inviterEmail: req.user?.email,
      acceptUrl,
      context: {
        clientLabel: client?.label || 'a client workspace',
        roleLabel: role === 'spouse' ? 'spouse access' : 'delegate access',
      },
    });

    await emailService.sendMail({
      to: email,
      subject,
      text,
      html,
      replyTo: req.user?.email,
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
