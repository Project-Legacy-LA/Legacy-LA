// utils/tokens.js
const { v4: uuidv4 } = require('uuid');
const redis = require('../config/redis');

const INVITE_PREFIX = 'invite:';
const DEFAULT_TTL = parseInt(process.env.INVITE_TTL_SECS || '', 10) || 60 * 60 * 24; // 24h

// normalize: accept "a-b-c" or "invite:a-b-c" and always produce "invite:a-b-c"
const key = (token) => token.startsWith(INVITE_PREFIX) ? token : INVITE_PREFIX + token;

/**
 * Create a new invite token in Redis.
 * Returns the RAW token (UUID) — keep prefixes internal only.
 */
async function createInviteToken(payload, ttl = DEFAULT_TTL) {
  if (!payload || !payload.user_id) {
    throw new Error('createInviteToken requires payload.user_id');
  }

  const token = uuidv4(); // raw
  await redis.setex(key(token), ttl, JSON.stringify({
    ...payload,
    created_at: new Date().toISOString(),
  }));

  // dev log (safe)
  console.log({
    inviteKey: key(token),
    ttl_seconds: ttl,
    payload: { ...payload, /* omit sensitive secrets if any */ },
  });

  return token; // return RAW token to caller
}

/** Verify token and return payload object, or null if missing/expired. */
async function verifyInviteToken(token) {
  if (!token) return null;
  console.log({"inVerifyToken":token,
    "with the key func":key(token)
  })
  const raw = await redis.get(key(token));
  return raw ? JSON.parse(raw) : null;
}

/** Delete token (after successful accept or cancellation). */
async function deleteInviteToken(token) {
  if (!token) return;
  await redis.del(key(token));
}

module.exports = {
  createInviteToken,
  verifyInviteToken,
  deleteInviteToken,
};
