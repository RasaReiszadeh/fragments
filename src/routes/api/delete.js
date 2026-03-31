const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    const ownerId = req.user;
    const { id } = req.params;

    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      const err = new Error('Fragment not found');
      err.status = 404;
      throw err;
    }

    await fragment.delete();

    req.log.info({ ownerId, id }, 'DELETE /v1/fragments/:id');

    res.status(200).json({
      status: 'ok',
    });
  } catch (err) {
    next(err);
  }
};