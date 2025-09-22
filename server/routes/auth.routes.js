const express = require('express');
const { login, register, getCurrentUser } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
