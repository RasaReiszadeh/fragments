const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app).put('/v1/fragments/someId').send('updated');
    expect(res.statusCode).toBe(401);
  });

  test('updating a fragment with the same type succeeds', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('original content');
    expect(postRes.statusCode).toBe(201);
    const id = postRes.body.fragment.id;

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('updated content');
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.status).toBe('ok');
  });

  test('updating a fragment with a different type returns 400', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('original content');
    expect(postRes.statusCode).toBe(201);
    const id = postRes.body.fragment.id;

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# updated content');
    expect(putRes.statusCode).toBe(400);
  });

  test('updating a non-existent fragment returns 404', async () => {
    const putRes = await request(app)
      .put('/v1/fragments/nonexistent-id')
      .auth('test-user1@fragments-testing.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('updated content');
    expect(putRes.statusCode).toBe(404);
  });
});

describe('DELETE /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app).delete('/v1/fragments/someId');
    expect(res.statusCode).toBe(401);
  });

  test('authenticated users can delete an existing fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello');
    expect(postRes.statusCode).toBe(201);
    const id = postRes.body.fragment.id;

    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'password1');
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.status).toBe('ok');
  });

  test('deleting a non-existent fragment returns 404', async () => {
    const deleteRes = await request(app)
      .delete('/v1/fragments/nonexistent-id')
      .auth('test-user1@fragments-testing.com', 'password1');
    expect(deleteRes.statusCode).toBe(404);
  });
});
