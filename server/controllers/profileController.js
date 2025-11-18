const personModel = require('../models/personModel');
const clientModel = require('../models/clientModel');
const userModel = require('../models/userModel');
const { success, error } = require('../utils/response');

function normalizePerson(person) {
  if (!person) return null;
  return {
    person_id: person.person_id,
    tenant_id: person.tenant_id,
    first_name: person.first_name,
    middle_name: person.middle_name,
    last_name: person.last_name,
    suffix: person.suffix,
    preferred_name: person.preferred_name,
    date_of_birth: person.date_of_birth,
    birth_country: person.birth_country,
    birth_admin_area: person.birth_admin_area,
    birth_locality: person.birth_locality,
  };
}

function normalizeClient(client) {
  if (!client) return null;
  return {
    client_id: client.client_id,
    tenant_id: client.tenant_id,
    label: client.label,
    residence_country: client.residence_country,
    residence_admin_area: client.residence_admin_area,
    residence_locality: client.residence_locality,
    residence_postal_code: client.residence_postal_code,
    residence_line1: client.residence_line1,
    residence_line2: client.residence_line2,
  };
}

async function getProfile(req, res) {
  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }

  try {
    const user = await userModel.findById(req.user.user_id);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    const person = user.person_id ? await personModel.findById(user.person_id) : null;
    const client = await clientModel.findPrimaryClientForUser(user.user_id);

    return success(res, {
      person: normalizePerson(person),
      client: normalizeClient(client),
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return error(res, 'Failed to load profile', 500);
  }
}

function pickSafe(value) {
  return value === '' ? null : value;
}

async function updateProfile(req, res) {
  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }

  const {
    person: personPayload = {},
    client: clientPayload = {},
  } = req.body || {};

  if (!personPayload.first_name || !personPayload.last_name) {
    return error(res, 'First and last name are required', 400);
  }

  if (!clientPayload.residence_country || !clientPayload.residence_admin_area || !clientPayload.residence_locality) {
    return error(res, 'Residence country, state, and city are required', 400);
  }

  try {
    const user = await userModel.findById(req.user.user_id);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    const client = await clientModel.findPrimaryClientForUser(user.user_id);
    if (!client) {
      return error(res, 'Client workspace not found', 404);
    }

    let person;
    const personInput = {
      firstName: personPayload.first_name,
      middleName: pickSafe(personPayload.middle_name),
      lastName: personPayload.last_name,
      suffix: pickSafe(personPayload.suffix),
      preferredName: pickSafe(personPayload.preferred_name),
      dateOfBirth: pickSafe(personPayload.date_of_birth),
      birthCountry: pickSafe(personPayload.birth_country),
      birthAdminArea: pickSafe(personPayload.birth_admin_area),
      birthLocality: pickSafe(personPayload.birth_locality),
    };

    if (user.person_id) {
      person = await personModel.updatePerson(user.person_id, personInput);
    } else {
      person = await personModel.createPerson({
        tenantId: client.tenant_id,
        ...personInput,
      });
      await userModel.attachPerson(user.user_id, person.person_id);
    }

    const updatedClient = await clientModel.updateClientResidence(client.client_id, {
      residenceCountry: clientPayload.residence_country,
      residenceAdminArea: clientPayload.residence_admin_area,
      residenceLocality: clientPayload.residence_locality,
      residencePostalCode: pickSafe(clientPayload.residence_postal_code),
      residenceLine1: pickSafe(clientPayload.residence_line1),
      residenceLine2: pickSafe(clientPayload.residence_line2),
    });

    return success(res, {
      person: normalizePerson(person),
      client: normalizeClient(updatedClient),
    }, 'Profile updated');
  } catch (err) {
    console.error('Update profile error:', err);
    return error(res, 'Failed to update profile', 500);
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
