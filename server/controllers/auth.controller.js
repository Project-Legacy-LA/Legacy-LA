const authService = require('../services/auth.service');
const ResponseUtil = require('../utils/response.util');

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return ResponseUtil.error(res, 'Email already registered');
        }

        // Create new user
        const newUser = await authService.createUser(email, password);
        
        // Generate token
        const token = await authService.generateToken(newUser.user_id);

        return ResponseUtil.created(res, {
            user: newUser,
            token
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await authService.findUserByEmail(email);
        if (!user) {
            return ResponseUtil.unauthorized(res, 'Invalid credentials');
        }

        // Check status
        if (user.status !== 'active') {
            return ResponseUtil.forbidden(res, 'Account is disabled');
        }

        // Verify password
        const validPassword = await authService.comparePasswords(password, user.password_digest);
        if (!validPassword) {
            return ResponseUtil.unauthorized(res, 'Invalid credentials');
        }

        // Generate token
        const token = await authService.generateToken(user.user_id);

        // Remove sensitive data
        delete user.password_digest;

        return ResponseUtil.success(res, {
            user,
            token
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await authService.findUserById(req.user.user_id);
        
        if (!user) {
            return ResponseUtil.notFound(res, 'User not found');
        }

        return ResponseUtil.success(res, { user });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};
