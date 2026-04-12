const Fragment = require('../../model/fragment');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const sharp = require('sharp');

module.exports = async (req, res, next) => {
  try {
    const ownerId = req.user;
    const { id, ext } = req.params;

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

    // No conversion requested
    if (!ext) {
      res.set('Content-Type', fragment.type);
      return res.status(200).send(data);
    }

    // Text conversions
    if (fragment.type === 'text/markdown' && ext === 'html') {
      const html = md.render(data.toString());
      res.set('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    if (fragment.type === 'text/markdown' && ext === 'txt') {
      res.set('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(data.toString());
    }

    if (fragment.type === 'application/json' && ext === 'txt') {
      res.set('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(data.toString());
    }

    if (
      (fragment.type === 'text/plain' && ext === 'txt') ||
      (fragment.type === 'text/html' && ext === 'html') ||
      (fragment.type === 'application/json' && ext === 'json')
    ) {
      res.set('Content-Type', fragment.type);
      return res.status(200).send(data);
    }

    // Image conversions using sharp
    const imageConversions = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
    };

    if (fragment.type.startsWith('image/') && imageConversions[ext]) {
      const converted = await sharp(data).toFormat(ext === 'jpg' ? 'jpeg' : ext).toBuffer();
      res.set('Content-Type', imageConversions[ext]);
      return res.status(200).send(converted);
    }

    const err = new Error('requested conversion is not supported');
    err.status = 415;
    throw err;
  } catch (err) {
    next(err);
  }
};