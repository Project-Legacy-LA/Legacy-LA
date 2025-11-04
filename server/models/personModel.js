const pool = require('../config/db');

async function createPerson({
  tenantId,
  firstName,
  middleName = null,
  lastName,
  suffix = null,
  preferredName = null,
  dateOfBirth = null,
  birthCountry = null,
  birthAdminArea = null,
  birthLocality = null,
}) {
  const { rows } = await pool.query(
    `
      INSERT INTO app.person (
        tenant_id,
        first_name,
        middle_name,
        last_name,
        suffix,
        preferred_name,
        date_of_birth,
        birth_country,
        birth_admin_area,
        birth_locality
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING person_id, tenant_id, first_name, middle_name, last_name, suffix, preferred_name, date_of_birth, birth_country, birth_admin_area, birth_locality
    `,
    [tenantId, firstName, middleName, lastName, suffix, preferredName, dateOfBirth, birthCountry, birthAdminArea, birthLocality]
  );

  return rows[0];
}

async function updatePerson(personId, {
  firstName,
  middleName = null,
  lastName,
  suffix = null,
  preferredName = null,
  dateOfBirth = null,
  birthCountry = null,
  birthAdminArea = null,
  birthLocality = null,
}) {
  const { rows } = await pool.query(
    `
      UPDATE app.person
         SET first_name = $2,
             middle_name = $3,
             last_name = $4,
             suffix = $5,
             preferred_name = $6,
             date_of_birth = $7,
             birth_country = $8,
             birth_admin_area = $9,
             birth_locality = $10,
             updated_at = now()
       WHERE person_id = $1
      RETURNING person_id, tenant_id, first_name, middle_name, last_name, suffix, preferred_name, date_of_birth, birth_country, birth_admin_area, birth_locality
    `,
    [personId, firstName, middleName, lastName, suffix, preferredName, dateOfBirth, birthCountry, birthAdminArea, birthLocality]
  );

  return rows[0];
}

async function findById(personId) {
  const { rows } = await pool.query(
    `
      SELECT person_id,
             tenant_id,
             first_name,
             middle_name,
             last_name,
             suffix,
             preferred_name,
             date_of_birth,
             birth_country,
             birth_admin_area,
             birth_locality
        FROM app.person
       WHERE person_id = $1
       LIMIT 1
    `,
    [personId]
  );

  return rows[0] || null;
}

module.exports = {
  createPerson,
  updatePerson,
  findById,
};
