const membershipModel = require('../models/membershipModel');
const clientModel = require('../models/clientModel');
const userService = require('./userService');
const { createInviteToken } = require('../utils/tokens');

/**
 * Invite an attorney owner to a tenant.
 */
async function inviteAttorney({ email, tenantId }) {
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

  return { user, token };
}

/**
 * Invite a client owner to a specific client.
 */
async function inviteClient({ email, tenantId, clientId }) {
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

  return { user, token };
}

/**
 * Invite a delegate (spouse/delegate) to a client.
 */
async function inviteDelegate({ email, tenantId, clientId, role }) {
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

  return { user, token };
}

module.exports = {
  inviteAttorney,
  inviteClient,
  inviteDelegate,
};
