// controllers/userController.js
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { success, error } = require('../utils/response');

/**
 * Create a bootstrap superuser.
 * Protected by ADMIN_SECRET env var (required).
 * POST /api/v1/users/superuser
 * Body: { email, password }
 * Header (or env): X-Admin-Secret
 */
async function createSuperuser(req, res) {
  const adminSecret = process.env.ADMIN_SECRET;
  const headerSecret = req.headers['x-admin-secret'];

  if (!adminSecret) {
    console.error('ADMIN_SECRET is not configured on the server');
    return error(res, 'Server misconfigured', 500);
  }

  if (!headerSecret || headerSecret !== adminSecret) {
    return error(res, 'Forbidden', 403);
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return error(res, 'Email and password are required', 400);
  }

  try {
    // Hash password for safety (even in dev)
    const hash = await bcrypt.hash(password, 10);

    // createUser returns user record
    const user = await userModel.createUser({
      email,
      passwordDigest: hash,
      status: 'active',
      personId: null,
      isSuperuser: true,
    });

    return success(res, { user_id: user.user_id, email: user.email }, 'Superuser created');
  } catch (err) {
    // unique constraint on email
    if (err.code === '23505') {
      return error(res, 'User with that email already exists', 409);
    }
    console.error('createSuperuser error:', err);
    return error(res, 'Failed to create superuser', 500);
  }
}

module.exports = {
  createSuperuser,
};


