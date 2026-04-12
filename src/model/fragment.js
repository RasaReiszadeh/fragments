const crypto = require('crypto');
const data = require('./data');

const SUPPORTED_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'text/html',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
]);

class Fragment {
  constructor({ id, ownerId, created, updated, type, size }) {
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  static isSupportedType(type) {
    return SUPPORTED_TYPES.has(type);
  }

  static create({ ownerId, type }) {
    if (!ownerId) {
      const err = new Error('ownerId is required');
      err.status = 400;
      throw err;
    }
    if (!Fragment.isSupportedType(type)) {
      const err = new Error('unsupported type');
      err.status = 415;
      throw err;
    }
    const now = new Date().toISOString();
    return new Fragment({
      id: crypto.randomUUID(),
      ownerId,
      created: now,
      updated: now,
      type,
      size: 0,
    });
  }

  get mimeType() {
    return this.type;
  }

  get isText() {
    return this.type.startsWith('text/');
  }

  get formats() {
    const formats = [];
    switch (this.type) {
      case 'text/plain':
        formats.push('txt');
        break;
      case 'text/markdown':
        formats.push('md', 'html', 'txt');
        break;
      case 'text/html':
        formats.push('html', 'txt');
        break;
      case 'application/json':
        formats.push('json', 'txt');
        break;
      case 'image/png':
        formats.push('png', 'jpg', 'gif', 'webp');
        break;
      case 'image/jpeg':
        formats.push('jpg', 'png', 'gif', 'webp');
        break;
      case 'image/gif':
        formats.push('gif', 'png', 'jpg', 'webp');
        break;
      case 'image/webp':
        formats.push('webp', 'png', 'jpg', 'gif');
        break;
      default:
        break;
    }
    return formats;
  }

  async save() {
    await data.writeFragment({
      id: this.id,
      ownerId: this.ownerId,
      created: this.created,
      updated: this.updated,
      type: this.type,
      size: this.size,
    });
    return this;
  }

  async setData(value) {
    let buffer;
    if (Buffer.isBuffer(value)) {
      buffer = value;
    } else if (typeof value === 'string') {
      buffer = Buffer.from(value);
    } else {
      const err = new Error('invalid fragment data');
      err.status = 400;
      throw err;
    }
    this.size = buffer.length;
    this.updated = new Date().toISOString();
    await data.writeFragmentData(this.ownerId, this.id, buffer);
    await this.save();
    return this;
  }

  async getData() {
    return data.readFragmentData(this.ownerId, this.id);
  }

  static async byId(ownerId, id) {
    const fragment = await data.readFragment(ownerId, id);
    return fragment ? new Fragment(fragment) : null;
  }

  static async list(ownerId, expand = false) {
    const ids = await data.listFragments(ownerId);
    if (!expand) {
      return ids;
    }
    const fragments = await Promise.all(ids.map((id) => Fragment.byId(ownerId, id)));
    return fragments.filter(Boolean);
  }

  static async listIds(ownerId) {
    return data.listFragments(ownerId);
  }

  async delete() {
    await data.deleteFragment(this.ownerId, this.id);
  }
}

module.exports = Fragment;