
const express = require('express');
const auth = require('../auth');

const router = express.Router();


router.get('/', require('./health'));


router.use('/v1', auth.authenticate(), require('./api'));

module.exports = router;
