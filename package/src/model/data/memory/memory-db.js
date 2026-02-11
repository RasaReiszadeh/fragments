

// ownerId -> (id -> fragmentMetadata)
const fragments = new Map();

// ownerId -> (id -> Buffer)
const fragmentData = new Map();

function _getUserMap(store, ownerId) {
  if (!store.has(ownerId)) store.set(ownerId, new Map());
  return store.get(ownerId);
}

module.exports = {
  // metadata
  getFragment(ownerId, id) {
    const userFrags = fragments.get(ownerId);
    return userFrags ? userFrags.get(id) : undefined;
  },

  putFragment(ownerId, id, value) {
    _getUserMap(fragments, ownerId).set(id, value);
  },

  listFragments(ownerId) {
    const userFrags = fragments.get(ownerId);
    return userFrags ? Array.from(userFrags.keys()) : [];
  },

  deleteFragment(ownerId, id) {
    const userFrags = fragments.get(ownerId);
    const userData = fragmentData.get(ownerId);
    if (userFrags) userFrags.delete(id);
    if (userData) userData.delete(id);
  },

  // data
  getFragmentData(ownerId, id) {
    const userData = fragmentData.get(ownerId);
    return userData ? userData.get(id) : undefined;
  },

  putFragmentData(ownerId, id, buffer) {
    _getUserMap(fragmentData, ownerId).set(id, buffer);
  },

  // test helper
  _reset() {
    fragments.clear();
    fragmentData.clear();
  },
};
