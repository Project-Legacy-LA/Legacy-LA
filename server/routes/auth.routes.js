const express = require('express');
const {
  register,
  login,
  getCurrentUser,
  logout,
  listSessions,
  logoutSession,
  logoutAllSessions
} = require('../../controllers/auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../../middleware/validate.middleware');

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', authMiddleware, logout); // current session
router.get('/me', authMiddleware, getCurrentUser);
router.get('/sessions', authMiddleware, listSessions);
router.delete('/sessions/:sid', authMiddleware, logoutSession);
router.delete('/sessions', authMiddleware, logoutAllSessions);

module.exports = router;
