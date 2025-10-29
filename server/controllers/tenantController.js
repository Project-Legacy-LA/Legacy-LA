const tenantModel = require('../models/tenantModel');
const membershipModel = require('../models/membershipModel');
const userService = require('../services/userService');
const emailService = require('../services/emailService');
const { createInviteToken } = require('../utils/tokens');
const { buildAcceptInviteUrl, buildInviteEmail } = require('../utils/inviteEmail');
const { success, error } = require('../utils/response');

async function onboardTenant(req, res) {
  const { email, display_name } = req.body;
  if (!email || !display_name) {
    return error(res, 'Email and display_name are required', 400);
  }

  try {
    const { user } = await userService.createInvitedUser(email);

    const tenant = await tenantModel.createTenant({
      ownerUserId: user.user_id,
      displayName: display_name,
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

    const acceptUrl = buildAcceptInviteUrl(token);
    const { subject, text, html } = buildInviteEmail({
      inviteType: 'attorney_owner',
      inviterEmail: req.user?.email,
      acceptUrl,
      context: { tenantName: display_name },
    });

    await emailService.sendMail({
      to: email,
      subject,
      text,
      html,
      replyTo: req.user?.email,
    });

    return success(
      res,
      {
        tenant_id: tenant.tenant_id,
        token,
        user_id: user.user_id,
        inviteLink: `/accept-invite?token=${token}`,
      },
      'Tenant onboarded successfully'
    );
  } catch (err) {
    console.error('Onboard tenant error:', err);
    return error(res, 'Failed to onboard tenant', 500);
  }
}

module.exports = { onboardTenant };
