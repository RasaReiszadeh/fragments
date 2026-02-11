// src/auth/basic-auth.js
const auth = require('http-auth');
const passport = require('passport');
const authPassport = require('http-auth-passport');
const logger = require('../logger');

if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

logger.info('Using HTTP Basic Auth for auth');

module.exports.which = 'basic';

// ✅ Return the strategy so app.js can do: passport.use(auth.strategy());
module.exports.strategy = () =>
  authPassport(
    auth.basic({
      file: process.env.HTPASSWD_FILE,
    })
  );

// ✅ Use the SAME name we register in app.js via passport.use('basic', ...)
module.exports.authenticate = () => passport.authenticate('basic', { session: false });
