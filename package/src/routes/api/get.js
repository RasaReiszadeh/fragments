const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    const ownerId = req.user;
    const fragments = await Fragment.listIds(ownerId);

    req.log.info({ ownerId, count: fragments.length }, 'GET /v1/fragments');

    res.status(200).json({ status: 'ok', fragments });
  } catch (err) {
    next(err);
  }
};
