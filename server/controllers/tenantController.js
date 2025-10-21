const pool = require('../config/db');
const userService = require('../services/userService');
const { createInviteToken } = require('../utils/tokens');
const { success, error } = require('../utils/response');

async function onboardTenant(req, res) {
  const { email, display_name } = req.body;
  if (!email || !display_name) {
    return error(res, 'Email and display_name are required', 400);
  }

  try {
    // 1) Create invited attorney user (disabled)
    const { user } = await userService.createInvitedUser(email);

    // 2) Create tenant
    const tenantResult = await pool.query(
      `
      INSERT INTO app.tenant (owner_user_id, display_name)
      VALUES ($1, $2)
      RETURNING tenant_id
      `,
      [user.user_id, display_name]
    );
    const tenantId = tenantResult.rows[0].tenant_id;

    // 3) Create membership (attorney_owner)
    await pool.query(
      `
      INSERT INTO app.membership (tenant_id, user_id, role, is_active)
      VALUES ($1, $2, 'attorney_owner', false)
      `,
      [tenantId, user.user_id]
    );

    // 4) Issue invite token
    const token = await createInviteToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      role: 'attorney_owner',
    });

    return success(res, {
      tenant_id: tenantId,
      user_id: user.user_id,
      inviteLink: `/accept-invite?token=${token}`,
    }, 'Tenant onboarded successfully');
  } catch (err) {
    console.error('Onboard tenant error:', err);
    return error(res, 'Failed to onboard tenant', 500);
  }
}

module.exports = { onboardTenant };
