// src/auth/auth-middleware.js
const passport = require('passport');
const crypto = require('crypto');

/**
 * Hash an identifier (email) consistently so we don't store raw emails on req.user.
 */
function hashUserId(email) {
  return crypto
    .createHash('sha256')
    .update(String(email).trim().toLowerCase())
    .digest('hex');
}

/**
 * authorize(strategyName)
 * - runs passport auth
 * - if authorized: sets req.user to a hashed value (sha256)
 * - if not: returns 401 JSON
 */
module.exports = (strategyName) => (req, res, next) => {
  passport.authenticate(strategyName, { session: false }, (err, user) => {
    if (err) return next(err);

    // If auth failed, passport gives `user` as false/undefined
    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: { message: 'unauthorized', code: 401 },
      });
    }

    // `user` might already be an email string (your cognito code does done(null, user.email))
    // or an object; handle both safely.
    const email = typeof user === 'string' ? user : user.email || user.user || user.username;

    // If we still can't find an email-like id, treat as auth failure
    if (!email) {
      return res.status(401).json({
        status: 'error',
        error: { message: 'unauthorized', code: 401 },
      });
    }

    req.user = hashUserId(email);
    return next();
  })(req, res, next);
};
