
// Get the full path to our env.jest file
const path = require('path');
const envFile = path.join(__dirname, 'env.jest');

// Read the environment variables we use for Jest from our env.jest file
require('dotenv').config({ path: envFile });


// Set our Jest options, see https://jestjs.io/docs/configuration
module.exports = {
  verbose: true,
  testTimeout: 5000,
  // Fail if we don't meet 80% line coverage with our tests
  // NOTE: you can comment this out until you get to 80%, but then
  // leave it on, so you don't ever fall below that threshold.
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};