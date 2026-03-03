
const Fragment = require('../../model/fragment');

module.exports = async (req, res) => {
  const ownerId = req.user;
  const { id } = req.params;

  req.log.info({ ownerId, id }, 'GET /v1/fragments/:id/info');

  try {
    const fragment = await Fragment.byId(ownerId, id);

    res.status(200).json({
      status: 'ok',
      fragment: fragment,
    });
  } catch  {
    req.log.warn({ ownerId, id }, 'Fragment not found');
    res.status(404).json({
      status: 'error',
      error: 'fragment not found',
    });
  }
};