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

    const data = await fragment.getData();
    if (!data) {
      const err = new Error('not found');
      err.status = 404;
      throw err;
    }

    req.log.info({ ownerId, id }, 'GET /v1/fragments/:id');

    res.set('Content-Type', fragment.type);
    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};
