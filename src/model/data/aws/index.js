const logger = require('../../../logger');
const MemoryDB = require('../memory/memory-db');
const s3Client = require('./s3Client');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const db = MemoryDB;

const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

module.exports = {
  async writeFragment(fragment) {
    db.putFragment(fragment.ownerId, fragment.id, fragment);
    return fragment;
  },

  async readFragment(ownerId, id) {
    return db.getFragment(ownerId, id);
  },

  async writeFragmentData(ownerId, id, buffer) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${ownerId}/${id}`,
      Body: buffer,
    };

    const command = new PutObjectCommand(params);

    try {
      logger.info(
        { Bucket: params.Bucket, Key: params.Key },
        'Uploading fragment data to S3'
      );

      await s3Client.send(command);

      logger.info(
        { Bucket: params.Bucket, Key: params.Key },
        'Successfully uploaded fragment data to S3'
      );

      return buffer.length;
    } catch (err) {
      const { Bucket, Key } = params;
      logger.error({ err, Bucket, Key }, 'Error uploading fragment data to S3');
      throw err;
    }
  },

  async readFragmentData(ownerId, id) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${ownerId}/${id}`,
    };

    const command = new GetObjectCommand(params);

    try {
      logger.info(
        { Bucket: params.Bucket, Key: params.Key },
        'Reading fragment data from S3'
      );

      const data = await s3Client.send(command);
      return streamToBuffer(data.Body);
    } catch (err) {
      const { Bucket, Key } = params;
      logger.error({ err, Bucket, Key }, 'Error streaming fragment data from S3');
      throw err;
    }
  },

  async listFragments(ownerId) {
    return db.listFragments(ownerId);
  },

  async deleteFragment(ownerId, id) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${ownerId}/${id}`,
    };

    const command = new DeleteObjectCommand(params);

    try {
      logger.info(
        { Bucket: params.Bucket, Key: params.Key },
        'Deleting fragment data from S3'
      );

      await s3Client.send(command);
      db.deleteFragment(ownerId, id);
    } catch (err) {
      const { Bucket, Key } = params;
      logger.error({ err, Bucket, Key }, 'Error deleting fragment data from S3');
      throw err;
    }
  },
};