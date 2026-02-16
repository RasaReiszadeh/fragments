
const crypto = require('crypto');
const data = require('./data');

const SUPPORTED_TYPES = new Set(['text/plain']);

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

  async setData(buffer) {
    if (!Buffer.isBuffer(buffer)) {
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
    const meta = await data.readFragment(ownerId, id);
    return meta ? new Fragment(meta) : null;
  }

  static async listIds(ownerId) {
    return data.listFragments(ownerId);
  }

  async delete() {
    await data.deleteFragment(this.ownerId, this.id);
  }
}

module.exports = Fragment;
