const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.config');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ 
                status: 'error',
                message: 'User already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await pool.query(
            'INSERT INTO "user" (email, password_digest, status) VALUES ($1, $2, $3) RETURNING user_id, email, status, created_at',
            [email, hashedPassword, 'active']
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            status: 'success',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error registering user' 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Check if user exists
        const result = await pool.query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Invalid credentials' 
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({
                status: 'error',
                message: 'Account is disabled'
            });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_digest);

        if (!validPassword) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password from response
        delete user.password;

        res.json({
            status: 'success',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error logging in' 
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, email, status, created_at, updated_at FROM "user" WHERE user_id = $1',
            [req.user.user_id]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ 
                status: 'error',
                message: 'User not found' 
            });
        }

        res.json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error getting user data' 
        });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};
