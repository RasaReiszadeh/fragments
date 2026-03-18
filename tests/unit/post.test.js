const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('hello');

    expect(res.statusCode).toBe(401);
  });

  test('authenticated users can create a text/plain fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('hello');

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toMatch(/\/v1\/fragments\//);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(5);
  });

  test('authenticated users can create a markdown fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/markdown')
      .send('# Hello');

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/markdown');
  });

  test('authenticated users can create a json fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ name: 'Rasa' }));

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('application/json');
  });

  test('unsupported types return 400', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'image/png')
      .send(Buffer.from([1, 2, 3]));

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});