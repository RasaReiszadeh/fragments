const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    const ownerId = req.user;
    const expand = req.query.expand === '1';
    const fragments = await Fragment.list(ownerId, expand);

    req.log.info({ ownerId, expand, count: fragments.length }, 'GET /v1/fragments');

    res.status(200).json({
      status: 'ok',
      fragments,
    });
  } catch (err) {
    next(err);
  }
};