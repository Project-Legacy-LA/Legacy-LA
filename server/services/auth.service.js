const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.config');

class AuthService {
    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, 10);
        } catch (error) {
            throw new Error('Password hashing failed');
        }
    }

    async comparePasswords(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error('Password comparison failed');
        }
    }

    generateToken(user_id) {
        try {
            return jwt.sign({ user_id }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });
        } catch (error) {
            throw new Error('Token generation failed');
        }
    }

    async findUserByEmail(email) {
        try {
            const query = `
                SELECT 
                    user_id,
                    email,
                    password_digest,
                    status,
                    created_at,
                    updated_at
                FROM "user" 
                WHERE email = $1
            `;
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async createUser(email, password) {
        try {
            const hashedPassword = await this.hashPassword(password);
            const query = `
                INSERT INTO "user" (
                    email, 
                    password_digest, 
                    status
                ) 
                VALUES ($1, $2, 'active')
                RETURNING 
                    user_id, 
                    email, 
                    status, 
                    created_at
            `;
            const result = await pool.query(query, [email, hashedPassword]);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Email already exists');
            }
            throw new Error(`User creation failed: ${error.message}`);
        }
    }

    async findUserById(user_id) {
        try {
            const query = `
                SELECT 
                    user_id,
                    email,
                    status,
                    created_at,
                    updated_at
                FROM "user" 
                WHERE user_id = $1
            `;
            const result = await pool.query(query, [user_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }
}

module.exports = new AuthService();
