const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.config');

class AuthService {
    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async comparePasswords(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
    }

    async findUserByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }
}

module.exports = new AuthService();
