
describe('src/auth/index.js', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('throws if both Cognito and Basic Auth env vars are set', () => {
    process.env.AWS_COGNITO_POOL_ID = 'pool';
    process.env.AWS_COGNITO_CLIENT_ID = 'client';
    process.env.HTPASSWD_FILE = '/tmp/htpasswd';
    expect(() => require('../../src/auth')).toThrow(/both AWS Cognito and HTTP Basic Auth/i);
  });

  test('loads cognito when Cognito env vars are set', () => {
    process.env.AWS_COGNITO_POOL_ID = 'pool';
    process.env.AWS_COGNITO_CLIENT_ID = 'client';

    jest.doMock('../../src/auth/cognito', () => ({ which: 'cognito' }));

    const auth = require('../../src/auth');
    expect(auth.which).toBe('cognito');
  });

  test('loads basic-auth when HTPASSWD_FILE is set and not production', () => {
    process.env.HTPASSWD_FILE = '/tmp/htpasswd';
    process.env.NODE_ENV = 'test';

   jest.doMock('../../src/auth/basic-auth', () => ({ which: 'basic' }));
    const auth = require('../../src/auth');
    expect(auth.which).toBe('basic');
  });

  test('throws in production if only HTPASSWD_FILE is set', () => {
    process.env.HTPASSWD_FILE = '/tmp/htpasswd';
    process.env.NODE_ENV = 'production';

    expect(() => require('../../src/auth')).toThrow(/no authorization configuration found/i);
  });

  test('throws when no authorization config is found', () => {
    process.env.NODE_ENV = 'test';
    expect(() => require('../../src/auth')).toThrow(/missing env vars/i);
  });
});
