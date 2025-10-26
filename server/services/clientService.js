const clientModel = require('../models/clientModel');

/**
 * Create a client under the active tenant for the current attorney.
 */
async function createClient({
  tenantId,
  primaryAttorneyUserId,
  label,
  relationshipStatus,
  residenceCountry,
  residenceAdminArea,
  residenceLocality,
  residencePostalCode,
  residenceLine1,
  residenceLine2,
}) {
  return clientModel.createClient({
    tenantId,
    primaryAttorneyUserId,
    label,
    relationshipStatus,
    residenceCountry,
    residenceAdminArea,
    residenceLocality,
    residencePostalCode,
    residenceLine1,
    residenceLine2,
  });
}

module.exports = {
  createClient,
};
