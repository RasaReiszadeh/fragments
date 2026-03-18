const contentType = require('content-type');
const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      const err = new Error('invalid fragment data');
      err.status = 400;
      throw err;
    }

    const { type } = contentType.parse(req);

    if (!Fragment.isSupportedType(type)) {
      const err = new Error('unsupported type');
      err.status = 415;
      throw err;
    }

    const ownerId = req.user;

    const fragment = Fragment.create({ ownerId, type });
    await fragment.save();
    await fragment.setData(req.body);

    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    const location = `${baseUrl}/v1/fragments/${fragment.id}`;

    res.setHeader('Location', location);

    req.log.info(
      { ownerId, id: fragment.id, type: fragment.type, size: fragment.size },
      'POST /v1/fragments'
    );

    res.status(201).json({
      status: 'ok',
      fragment,
    });
  } catch (err) {
    next(err);
  }
};