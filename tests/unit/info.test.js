const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('returns metadata for an existing fragment', async () => {
    const create = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ course: 'CCP555' }));

    const id = create.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('test-user1@fragments-testing.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBe(id);
    expect(res.body.fragment.type).toBe('application/json');
  });

  test('returns 404 for missing fragment', async () => {
    const res = await request(app)
      .get('/v1/fragments/nope/info')
      .auth('test-user1@fragments-testing.com', 'password1');

    expect(res.statusCode).toBe(404);
  });
});