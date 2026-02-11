const express = require('express');
const contentType = require('content-type');
const Fragment = require('../../model/fragment');

const { authenticate } = require('../../auth'); 

const router = express.Router();

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      try {
        const { type } = contentType.parse(req);
        return Fragment.isSupportedType(type);
      } catch {
        return false;
      }
    },
  });

router.get('/fragments', authenticate(), require('./get'));
router.post('/fragments', authenticate(), rawBody(), require('./post'));
router.get('/fragments/:id', authenticate(), require('./get-by-id'));

module.exports = router;
