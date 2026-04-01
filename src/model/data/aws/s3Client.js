const { S3Client } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');

const getCredentials = () => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    logger.debug('Using S3 credentials from environment variables');
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  return undefined;
};

const getS3Endpoint = () => {
  if (process.env.AWS_S3_ENDPOINT_URL) {
    logger.debug(
      { endpoint: process.env.AWS_S3_ENDPOINT_URL },
      'Using alternate S3 endpoint'
    );
    return process.env.AWS_S3_ENDPOINT_URL;
  }

  return undefined;
};

const config = {
  region: process.env.AWS_REGION,
};

const credentials = getCredentials();
if (credentials) {
  config.credentials = credentials;
}

const endpoint = getS3Endpoint();
if (endpoint) {
  config.endpoint = endpoint;
  config.forcePathStyle = true;
}

module.exports = new S3Client(config);