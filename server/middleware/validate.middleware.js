const ResponseUtil = require('../utils/response.util');

const validateRegistration = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return ResponseUtil.error(res, 'Email and password are required', 400);
    }

    if (typeof email !== 'string' || !email.includes('@')) {
        return ResponseUtil.error(res, 'Invalid email format', 400);
    }

    if (typeof password !== 'string' || password.length < 8) {
        return ResponseUtil.error(res, 'Password must be at least 8 characters long', 400);
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return ResponseUtil.error(res, 'Email and password are required', 400);
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
};
