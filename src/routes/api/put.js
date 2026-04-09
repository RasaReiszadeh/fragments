const contentType = require('content-type');
const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    const ownerId = req.user;
    const { id } = req.params;

    if (!Buffer.isBuffer(req.body)) {
      const err = new Error('invalid fragment data');
      err.status = 400;
      throw err;
    }

    const { type } = contentType.parse(req);

    // Get the existing fragment
    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      const err = new Error('Fragment not found');
      err.status = 404;
      throw err;
    }

    // Type cannot be changed
    if (fragment.type !== type) {
      const err = new Error(`Cannot change fragment type from ${fragment.type} to ${type}`);
      err.status = 400;
      throw err;
    }

    await fragment.setData(req.body);

    req.log.info({ ownerId, id, type, size: fragment.size }, 'PUT /v1/fragments/:id');

    res.status(200).json({
      status: 'ok',
      fragment,
    });
  } catch (err) {
    next(err);
  }
};