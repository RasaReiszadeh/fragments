
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
  expect(() => Fragment.create({ ownerId: 'u1', type: 'image/png' })).toThrow(
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

describe('Fragment extra coverage', () => {
  test('throws when ownerId is missing', () => {
    expect(() => Fragment.create({ type: 'text/plain' })).toThrow(/ownerId/i);
  });

  test('mimeType returns the type', () => {
    const fragment = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    expect(fragment.mimeType).toBe('text/plain');
  });

  test('isText returns true for text fragments', () => {
    const fragment = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    expect(fragment.isText).toBe(true);
  });

  test('isText returns false for json fragments', () => {
    const fragment = Fragment.create({ ownerId: 'u1', type: 'application/json' });
    expect(fragment.isText).toBe(false);
  });

  test('formats returns expected values for markdown', () => {
    const fragment = Fragment.create({ ownerId: 'u1', type: 'text/markdown' });
    expect(fragment.formats).toEqual(expect.arrayContaining(['md', 'html', 'txt']));
  });

  test('formats returns expected values for json', () => {
    const fragment = Fragment.create({ ownerId: 'u1', type: 'application/json' });
    expect(fragment.formats).toEqual(expect.arrayContaining(['json', 'txt']));
  });

  test('setData throws on invalid data', async () => {
    const fragment = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    await expect(fragment.setData({ bad: true })).rejects.toThrow(/invalid fragment data/i);
  });

  test('delete removes a fragment', async () => {
    const fragment = Fragment.create({ ownerId: 'u1', type: 'text/plain' });
    await fragment.save();
    await fragment.setData('hello');
    await fragment.delete();

    const loaded = await Fragment.byId('u1', fragment.id);
    expect(loaded).toBe(null);
  });
});