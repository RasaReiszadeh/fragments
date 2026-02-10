
describe('src/logger.js', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('uses info level by default', () => {
    jest.doMock('pino', () => jest.fn(() => ({ mocked: true })));
    delete process.env.FRAGMENTS_LOG_LEVEL;

    // require after mocking
    require('../../src/logger');
    const pino = require('pino');

    expect(pino).toHaveBeenCalled();
    const options = pino.mock.calls[0][0];
    expect(options.level).toBe('info');
  });

  test('adds pino-pretty transport when level is debug', () => {
    jest.doMock('pino', () => jest.fn(() => ({ mocked: true })));
    process.env.FRAGMENTS_LOG_LEVEL = 'debug';

    require('../../src/logger');
    const pino = require('pino');

    expect(pino).toHaveBeenCalled();
    const options = pino.mock.calls[0][0];

    expect(options.level).toBe('debug');
    expect(options.transport).toBeDefined();
    expect(options.transport.target).toBe('pino-pretty');
    expect(options.transport.options).toBeDefined();
    expect(options.transport.options.colorize).toBe(true);
  });
});
