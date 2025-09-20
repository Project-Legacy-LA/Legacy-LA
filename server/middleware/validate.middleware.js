const validateRegistration = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            error: {
                message: 'Email and password are required',
                status: 400
            }
        });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({
            error: {
                message: 'Invalid email format',
                status: 400
            }
        });
    }

    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
            error: {
                message: 'Password must be at least 8 characters long',
                status: 400
            }
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            error: {
                message: 'Email and password are required',
                status: 400
            }
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
};
