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
router.get('/fragments/:id/info', authenticate(), require('./info'));
router.get('/fragments/:id.:ext', authenticate(), require('./get-by-id'));
router.get('/fragments/:id', authenticate(), require('./get-by-id'));
router.post('/fragments', rawBody(), authenticate(), require('./post'));
router.delete('/fragments/:id', authenticate(), require('./delete'));
module.exports = router;