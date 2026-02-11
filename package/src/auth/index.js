// src/auth/index.js

if (
  process.env.AWS_COGNITO_POOL_ID &&
  process.env.AWS_COGNITO_CLIENT_ID &&
  process.env.HTPASSWD_FILE
) {
  throw new Error(
    'env contains configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.'
  );
}

let auth;

if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  auth = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.env.NODE_ENV !== 'production') {
  auth = require('./basic-auth');
} else {
  throw new Error('missing env vars: no authorization configuration found');
}

module.exports = {
  which: auth.which,
  strategy: auth.strategy,
  authenticate: auth.authenticate,
};

