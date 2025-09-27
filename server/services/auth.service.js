const bcrypt = require('bcrypt');
const pool = require('../config/db.config');
const redis = require('../config/redis.config');
const { v4: uuidv4 } = require('uuid');
const { parseDevice } = require('../utils/device.util');
const { lookupLocation } = require('../utils/location.util');


class AuthService {
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async findUserByEmail(email) {
    const query = `
      SELECT user_id, email, password_digest, status, created_at, updated_at
      FROM app.users 
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async createUser(email, password) {
    const hashedPassword = await this.hashPassword(password);
    const query = `
      INSERT INTO app.users (email, password_digest, status) 
      VALUES ($1, $2, 'active')
      RETURNING user_id, email, status, created_at
    `;
    const result = await pool.query(query, [email, hashedPassword]);
    return result.rows[0];
  }

  async findUserById(user_id) {
    const query = `
      SELECT user_id, email, status, created_at, updated_at
      FROM app.users 
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }

  // --- NEW: session management ---

async createSession(user, ip, userAgent) {
  const sid = uuidv4();
  const deviceInfo = parseDevice(userAgent);
  const locationInfo = lookupLocation(ip);

  const sessionData = {
    user_id: user.user_id,
    email: user.email,
    ip,
    device: deviceInfo,
    location: locationInfo,
    created_at: Date.now(),
    last_seen: Date.now()
  };

  await redis.set(`session:${sid}`, JSON.stringify(sessionData), 'EX', 60 * 60 * 24);
  await redis.sadd(`user_sessions:${user.user_id}`, sid);

  return { sid, sessionData };
}


  async getSession(sid) {
    const raw = await redis.get(`session:${sid}`);
    return raw ? JSON.parse(raw) : null;
  }

  async updateSessionActivity(sid) {
    const raw = await redis.get(`session:${sid}`);
    if (!raw) return null;
    const session = JSON.parse(raw);
    session.last_seen = Date.now();
    await redis.set(`session:${sid}`, JSON.stringify(session), 'EX', 60 * 60 * 24);
    return session;
  }

  async destroySession(sid, user_id) {
    await redis.del(`session:${sid}`);
    if (user_id) {
      await redis.srem(`user_sessions:${user_id}`, sid);
    }
  }

  async listUserSessions(user_id) {
    const sids = await redis.smembers(`user_sessions:${user_id}`);
    const sessions = await Promise.all(
      sids.map(async sid => {
        const raw = await redis.get(`session:${sid}`);
        return raw ? { sid, ...JSON.parse(raw) } : null;
      })
    );
    return sessions.filter(Boolean);
  }

  async destroyAllSessions(user_id) {
    const sids = await redis.smembers(`user_sessions:${user_id}`);
    if (sids.length > 0) {
      const pipeline = redis.pipeline();
      sids.forEach(sid => pipeline.del(`session:${sid}`));
      await pipeline.exec();
    }
    await redis.del(`user_sessions:${user_id}`);
  }

    async destroyUserSession(user_id, sid) {
    // Only allow deleting if sid belongs to the user
    const belongs = await redis.sismember(`user_sessions:${user_id}`, sid);
    if (!belongs) return false;

    await this.destroySession(sid, user_id);
    return true;
  }

}

module.exports = new AuthService();
