const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app).get('/v1/fragments/some-id');
    expect(res.statusCode).toBe(401);
  });

  test('returns 404 for unknown fragment', async () => {
    const res = await request(app)
      .get('/v1/fragments/does-not-exist')
      .auth('test-user1@fragments-testing.com', 'password1');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(undefined);
  });

  test('create then fetch returns raw text', async () => {
    const create = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('hello');

    const id = create.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toBe('hello');
  });
});
