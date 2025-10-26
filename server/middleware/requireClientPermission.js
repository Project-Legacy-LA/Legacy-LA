// middleware/requireClientPermission.js
const clientModel = require('../models/clientModel');
const { error } = require('../utils/response');

/**
 * Normalize permission array values and check presence
 */
function grantHasPermission(grant, needed) {
  if (!grant || !grant.permissions) return false;
  const perms = grant.permissions.map(p => String(p).toLowerCase());
  return perms.includes(String(needed).toLowerCase());
}

/**
 * requireClientPermission('read'|'write'|'delete')
 */
function requireClientPermission(needed) {
  return async (req, res, next) => {
    try {
      if (!req.user) return error(res, 'Not authenticated', 401);

      const clientId =
        req.params?.client_id ||
        req.params?.id ||
        req.body?.client_id ||
        req.body?.clientId;

      if (!clientId) return error(res, 'client_id required', 400);

      // load client info
      const client = await clientModel.getClientById(clientId);
      if (!client) return error(res, 'Client not found', 404);

      const actorId = String(req.user.user_id);

      // 1) primary attorney = full access (read/write/delete)
      if (actorId === String(client.primary_attorney_user_id)) {
        // before allowing write/delete, check editing_frozen: primary attorney is allowed to modify even if frozen (so they can unfreeze)
        // Primary attorney gets full access always.
        req.client = client;
        req.clientAccessVia = 'primary_attorney';
        return next();
      }

      // 2) client_account - client themselves or household (enabled)
      const ca = await clientModel.getClientAccount(actorId, clientId);
      if (ca && ca.is_enabled) {
        // client_account users: can read; can write/delete only if permission logic allows and client not frozen
        if (needed === 'read') {
          req.client = client;
          req.clientAccessVia = 'client_account';
          return next();
        }

        // write/delete requests: if editing_frozen, deny (only primary attorney allowed)
        if (client.editing_frozen) {
          return error(res, 'Client data is frozen — updates are disabled', 403);
        }

        // allow write/delete for client_account (owner/spouse/delegate) — you may add further role checks (role === 'owner') if desired
        req.client = client;
        req.clientAccessVia = 'client_account';
        return next();
      }

      // 3) client_grant: must exist and include the needed permission
      const grants = (req.user.client_grants || []).filter(g => String(g.client_id) === String(clientId) && g.is_enabled);
      if (!grants || grants.length === 0) {
        return error(res, 'Forbidden: no grant for this client', 403);
      }

      // pick any grant that permits action
      const permittedGrant = grants.find(g => grantHasPermission(g, needed));
      if (!permittedGrant) {
        return error(res, 'Forbidden: insufficient grant permissions for this client', 403);
      }

      // if client.editing_frozen and action is write/delete, deny (only primary attorney may change)
      if ((needed === 'write' || needed === 'delete') && client.editing_frozen) {
        return error(res, 'Client data is frozen — updates are disabled', 403);
      }

      // success via client_grant
      req.client = client;
      req.clientGrant = permittedGrant;
      req.clientAccessVia = 'client_grant';
      return next();
    } catch (err) {
      console.error('requireClientPermission error:', err);
      return error(res, 'Authorization error', 500);
    }
  };
}

module.exports = requireClientPermission;
