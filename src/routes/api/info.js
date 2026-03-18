const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    const ownerId = req.user;
    const { id } = req.params;

    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      const err = new Error('not found');
      err.status = 404;
      throw err;
    }

    req.log.info({ ownerId, id }, 'GET /v1/fragments/:id/info');

    res.status(200).json({
      status: 'ok',
      fragment,
    });
  } catch (err) {
    next(err);
  }
};