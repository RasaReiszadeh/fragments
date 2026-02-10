
const db = require('../../src/model/data/memory/memory-db');

describe('memory-db', () => {
  beforeEach(() => db._reset());

  test('stores and retrieves fragment metadata per user', () => {
    const ownerId = 'userA';
    const id = 'id1';
    db.putFragment(ownerId, id, { id, ownerId, type: 'text/plain', size: 3 });

    expect(db.getFragment(ownerId, id)).toEqual({ id, ownerId, type: 'text/plain', size: 3 });
    expect(db.getFragment('userB', id)).toBeUndefined();
  });

  test('stores and retrieves fragment data per user', () => {
    const ownerId = 'userA';
    const id = 'id1';
    const buf = Buffer.from('abc');
    db.putFragmentData(ownerId, id, buf);

    expect(db.getFragmentData(ownerId, id)).toEqual(buf);
    expect(db.getFragmentData('userB', id)).toBeUndefined();
  });

  test('lists fragment ids', () => {
    const ownerId = 'userA';
    db.putFragment(ownerId, 'a', {});
    db.putFragment(ownerId, 'b', {});
    expect(db.listFragments(ownerId).sort()).toEqual(['a', 'b']);
    expect(db.listFragments('userB')).toEqual([]);
  });

  test('deletes metadata and data', () => {
    const ownerId = 'userA';
    const id = 'id1';
    db.putFragment(ownerId, id, { id });
    db.putFragmentData(ownerId, id, Buffer.from('x'));

    db.deleteFragment(ownerId, id);
    expect(db.getFragment(ownerId, id)).toBeUndefined();
    expect(db.getFragmentData(ownerId, id)).toBeUndefined();
  });
});
