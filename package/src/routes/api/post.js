const contentType = require('content-type');
const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    // We expect raw bytes (express.raw middleware should be used on this route)
    if (!Buffer.isBuffer(req.body)) {
      const err = new Error('invalid fragment data');
      err.status = 400;
      throw err;
    }

    // Parse and validate Content-Type
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

    const baseUrl = process.env.API_URL
      ? process.env.API_URL
      : `${req.protocol}://${req.headers.host}`;

    const location = new URL(`/v1/fragments/${fragment.id}`, baseUrl).toString();
    res.set('Location', location);

    req.log.info(
      { ownerId, id: fragment.id, type: fragment.type, size: fragment.size },
      'POST /v1/fragments'
    );

    res.status(201).json({
      status: 'ok',
      fragment: {
        id: fragment.id,
        ownerId: fragment.ownerId,
        created: fragment.created,
        updated: fragment.updated,
        type: fragment.type,
        size: fragment.size,
      },
    });
  } catch (err) {
    next(err);
  }
};
