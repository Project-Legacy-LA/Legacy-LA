const pool = require('../config/db.config');
const bcrypt = require('bcrypt');

class User {
    static async create({ email, password }) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `
                INSERT INTO "users" (email, password_digest, status)
                VALUES ($1, $2, 'active')
                RETURNING user_id, email, status
            `;
            const values = [email, hashedPassword, first_name, last_name, role];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        try {
            const query = 'SELECT user_id, email, password_digest, status FROM "users" WHERE email = $1';
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const query = 'SELECT user_id, email, status, person_id FROM "users" WHERE user_id = $1';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    static async update(userId, updates) {
        try {
            const allowedUpdates = ['email', 'status', 'person_id'];
            const updateFields = Object.keys(updates)
                .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined);
            
            if (updateFields.length === 0) return null;

            if (updates.status && !['active', 'disabled'].includes(updates.status)) {
                throw new Error('Invalid status value');
            }

            const setClause = updateFields
                .map((field, index) => `${field} = $${index + 2}`)
                .join(', ');
            const values = updateFields.map(field => updates[field]);

            const query = `
                UPDATE "user" 
                SET ${setClause}, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $1
                RETURNING user_id, email, status, person_id
            `;

            const result = await pool.query(query, [id, ...values]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const query = 'DELETE FROM "user" WHERE user_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
