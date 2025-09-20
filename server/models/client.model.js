const pool = require('../config/db.config');

class Client {
    static async create({ 
        tenant_id, 
        primary_attorney_user_id, 
        label, 
        relationship_status, 
        residence_country, 
        residence_admin_area, 
        residence_locality, 
        residence_postal_code, 
        residence_line1, 
        residence_line2 
    }) {
        try {
            const query = `
                INSERT INTO client (
                    tenant_id, primary_attorney_user_id, label, status,
                    relationship_status, residence_country, residence_admin_area,
                    residence_locality, residence_postal_code, residence_line1, residence_line2
                )
                VALUES ($1, $2, $3, 'active', $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
            `;
            const values = [
                tenant_id, primary_attorney_user_id, label,
                relationship_status, residence_country, residence_admin_area,
                residence_locality, residence_postal_code, residence_line1, residence_line2
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating client: ${error.message}`);
        }
    }

    static async findById(clientId, tenantId) {
        try {
            const query = `
                SELECT * FROM client 
                WHERE client_id = $1 AND tenant_id = $2
            `;
            const result = await pool.query(query, [clientId, tenantId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding client: ${error.message}`);
        }
    }

    static async findByTenant(tenantId) {
        try {
            const query = `
                SELECT * FROM client 
                WHERE tenant_id = $1 
                ORDER BY created_at DESC
            `;
            const result = await pool.query(query, [tenantId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error finding clients: ${error.message}`);
        }
    }

    static async update(clientId, tenantId, updates) {
        try {
            const allowedUpdates = [
                'primary_attorney_user_id', 'label', 'status',
                'relationship_status', 'residence_country', 'residence_admin_area',
                'residence_locality', 'residence_postal_code', 'residence_line1', 'residence_line2'
            ];
            
            const updateFields = Object.keys(updates)
                .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined);
            
            if (updateFields.length === 0) return null;

            if (updates.status && !['active', 'archived'].includes(updates.status)) {
                throw new Error('Invalid status value');
            }

            const setClause = updateFields
                .map((field, index) => `${field} = $${index + 3}`)
                .join(', ');
            const values = updateFields.map(field => updates[field]);

            const query = `
                UPDATE client 
                SET ${setClause}, updated_at = CURRENT_TIMESTAMP
                WHERE client_id = $1 AND tenant_id = $2
                RETURNING *
            `;

            const result = await pool.query(query, [clientId, tenantId, ...values]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating client: ${error.message}`);
        }
    }

    static async delete(clientId, tenantId) {
        try {
            const query = `
                DELETE FROM client 
                WHERE client_id = $1 AND tenant_id = $2 
                RETURNING *
            `;
            const result = await pool.query(query, [clientId, tenantId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting client: ${error.message}`);
        }
    }
}

module.exports = Client;
