
const db = require('../../src/model/data/memory/memory-db');
const memory = require('../../src/model/data/memory');

describe('memory data strategy', () => {
  beforeEach(() => db._reset());

  test('writeFragment/readFragment', async () => {
    const frag = { id: 'id1', ownerId: 'u1', type: 'text/plain', size: 0 };
    await memory.writeFragment(frag);
    const read = await memory.readFragment('u1', 'id1');
    expect(read).toEqual(frag);
  });

  test('writeFragmentData/readFragmentData', async () => {
    const buf = Buffer.from('hello');
    await memory.writeFragmentData('u1', 'id1', buf);
    const read = await memory.readFragmentData('u1', 'id1');
    expect(read).toEqual(buf);
  });

  test('listFragments', async () => {
    await memory.writeFragment({ id: 'a', ownerId: 'u1' });
    await memory.writeFragment({ id: 'b', ownerId: 'u1' });
    const ids = await memory.listFragments('u1');
    expect(ids.sort()).toEqual(['a', 'b']);
  });

  test('deleteFragment', async () => {
    await memory.writeFragment({ id: 'a', ownerId: 'u1' });
    await memory.writeFragmentData('u1', 'a', Buffer.from('x'));
    await memory.deleteFragment('u1', 'a');

    expect(await memory.readFragment('u1', 'a')).toBeUndefined();
    expect(await memory.readFragmentData('u1', 'a')).toBeUndefined();
  });
});
