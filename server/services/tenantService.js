const tenantModel = require('../models/tenantModel');
const membershipModel = require('../models/membershipModel');
const userService = require('./userService');
const { createInviteToken } = require('../utils/tokens');

/**
 * Create a tenant, link an invited attorney owner, and issue an invite token.
 */
async function onboardTenant({ email, displayName }) {
  const { user } = await userService.createInvitedUser(email);

  const tenant = await tenantModel.createTenant({
    ownerUserId: user.user_id,
    displayName,
  });

  await membershipModel.createMembership({
    tenantId: tenant.tenant_id,
    userId: user.user_id,
    role: 'attorney_owner',
    isActive: false,
  });

  const token = await createInviteToken({
    user_id: user.user_id,
    tenant_id: tenant.tenant_id,
    role: 'attorney_owner',
  });

  return {
    tenant,
    user,
    token,
  };
}

module.exports = {
  onboardTenant,
};
