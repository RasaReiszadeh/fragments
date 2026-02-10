
const db = require('./memory-db');

// All functions return Promises (async API)
module.exports = {
  async writeFragment(fragment) {
    db.putFragment(fragment.ownerId, fragment.id, fragment);
    return fragment;
  },

  async readFragment(ownerId, id) {
    return db.getFragment(ownerId, id);
  },

  async writeFragmentData(ownerId, id, buffer) {
    db.putFragmentData(ownerId, id, buffer);
    return buffer.length;
  },

  async readFragmentData(ownerId, id) {
    return db.getFragmentData(ownerId, id);
  },

  async listFragments(ownerId) {
    return db.listFragments(ownerId);
  },

  async deleteFragment(ownerId, id) {
    db.deleteFragment(ownerId, id);
  },
};
