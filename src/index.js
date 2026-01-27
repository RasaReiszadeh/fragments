// src/index.js

// Load environment variables from .env (only once, here)
require('dotenv').config();

// Get our logger
const logger = require('./logger');

// Log uncaught exceptions (crashes)
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

// Start the server
require('./server');
const unneededVariable = 'This variable is never used';
