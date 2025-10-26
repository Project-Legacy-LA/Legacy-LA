const tenantService = require('../services/tenantService');
const { success, error } = require('../utils/response');

async function onboardTenant(req, res) {
  const { email, display_name } = req.body;
  if (!email || !display_name) {
    return error(res, 'Email and display_name are required', 400);
  }

  try {
    const { tenant, user, token } = await tenantService.onboardTenant({
      email,
      displayName: display_name,
    });

    return success(res, {
      tenant_id: tenant.tenant_id,
      token,
      user_id: user.user_id,
      inviteLink: `/accept-invite?token=${token}`,
    }, 'Tenant onboarded successfully');
  } catch (err) {
    console.error('Onboard tenant error:', err);
    return error(res, 'Failed to onboard tenant', 500);
  }
}

module.exports = { onboardTenant };
