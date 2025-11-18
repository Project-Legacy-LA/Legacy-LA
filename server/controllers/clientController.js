const clientModel = require('../models/clientModel');
const userService = require('../services/userService');
const emailService = require('../services/emailService');
const { createInviteToken } = require('../utils/tokens');
const { buildAcceptInviteUrl, buildInviteEmail } = require('../utils/inviteEmail');
const { success, error } = require('../utils/response');

/**
 * Create a new client and send an invitation email
 * @route POST /api/v1/client
 * @body { email, label, relationship_status, residence_country, residence_admin_area, residence_locality, ... }
 */
async function createClient(req, res) {
  const actor = req.user; // set by session middleware
  if (!actor) {
    return error(res, 'Not authenticated', 401);
  }

  const tenantId = actor.active_tenant;
  if (!tenantId) {
    return error(res, 'Active tenant context required', 400);
  }

  const {
    email,
    label,
    relationship_status,
    residence_country,
    residence_admin_area,
    residence_locality,
    residence_postal_code,
    residence_line1,
    residence_line2
  } = req.body;

  if (!email) {
    return error(res, 'Client email is required', 400);
  }

  if (!label || !relationship_status || !residence_country || !residence_admin_area || !residence_locality) {
    return error(res, 'Missing required fields', 400);
  }

  try {
    // 1) Create the invited user (disabled)
    const { user } = await userService.createInvitedUser(email);

    // 2) Build the client record for this tenant/attorney
    const client = await clientModel.createClient({
      tenantId,
      primaryAttorneyUserId: actor.user_id,
      label,
      relationshipStatus: relationship_status,
      residenceCountry: residence_country,
      residenceAdminArea: residence_admin_area,
      residenceLocality: residence_locality,
      residencePostalCode: residence_postal_code || null,
      residenceLine1: residence_line1 || null,
      residenceLine2: residence_line2 || null,
    });

    // 3) Associate the invited user with the client account (disabled until invite accepted)
    await clientModel.createClientAccount({
      tenantId,
      clientId: client.client_id,
      userId: user.user_id,
      role: 'owner',
      isEnabled: false,
    });

    // 4) Issue invite token for the client owner
    const token = await createInviteToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      client_id: client.client_id,
      role: 'client_owner',
    });

    // 5) Send the invite email
    const acceptUrl = buildAcceptInviteUrl(token);
    const { subject, text, html } = buildInviteEmail({
      inviteType: 'client_owner',
      inviterEmail: actor.email,
      acceptUrl,
      context: {
        clientLabel: client.label,
      },
    });

    await emailService.sendMail({
      to: email,
      subject,
      text,
      html,
      replyTo: actor.email,
    });

    return success(
      res,
      {
        client,
        invitation: {
          user_id: user.user_id,
          token,
          accept_url: acceptUrl.toString(),
        },
      },
      'Client invited successfully'
    );
  } catch (err) {
    console.error('Create client error:', err);
    if (err.code === '23505') {
      return error(res, 'A user with that email already exists', 409);
    }
    return error(res, 'Failed to create client', 500);
  }
}

module.exports = {
  createClient
};
