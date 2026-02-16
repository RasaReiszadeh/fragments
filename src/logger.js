
const options = { level: process.env.FRAGMENTS_LOG_LEVEL || 'info' };

if (options.level === 'debug') {

  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}


module.exports = require('pino')(options);
