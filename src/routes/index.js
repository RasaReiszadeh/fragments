// src/routes/index.js
const express = require('express');
const auth = require('../auth');

const router = express.Router();

// Public health check (no auth)
router.get('/', require('./health'));

// 🔒 ALL versioned API routes require auth
router.use('/v1', auth.authenticate(), require('./api'));

module.exports = router;
