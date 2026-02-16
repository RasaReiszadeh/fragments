
const db = require('../../src/model/data/memory/memory-db');
const Fragment = require('../../src/model/fragment');

describe('Fragment', () => {
  beforeEach(() => db._reset());

  test('creates a text/plain fragment with metadata', () => {
    const f = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    expect(f.id).toBeTruthy();
    expect(f.ownerId).toBe('u1');
    expect(f.type).toBe('text/plain');
    expect(typeof f.created).toBe('string');
    expect(typeof f.updated).toBe('string');
  });

  test('rejects unsupported types', () => {
    expect(() => Fragment.create({ ownerId: 'u1', type: 'application/json' })).toThrow(
      /unsupported type/i
    );
  });

  test('saves and loads by id', async () => {
    const f = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    await f.save();

    const loaded = await Fragment.byId('u1', f.id);
    expect(loaded).not.toBeNull();
    expect(loaded.id).toBe(f.id);
    expect(loaded.ownerId).toBe('u1');
  });

  test('stores and retrieves data', async () => {
    const f = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    await f.save();
    await f.setData(Buffer.from('hello'));

    const loaded = await Fragment.byId('u1', f.id);
    const data = await loaded.getData();
    expect(data.toString()).toBe('hello');
    expect(loaded.size).toBe(5);
  });

  test('lists ids per user', async () => {
    const f1 = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    const f2 = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    await f1.save();
    await f2.save();

    const ids = await Fragment.listIds('u1');
    expect(ids).toEqual(expect.arrayContaining([f1.id, f2.id]));
  });
});
