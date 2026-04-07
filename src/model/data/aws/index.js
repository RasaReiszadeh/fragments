const logger = require('../../../logger');
const s3Client = require('./s3Client');
const ddbDocClient = require('./ddbDocClient');
console.log('DEBUG ddbDocClient:', ddbDocClient);
console.log('DEBUG typeof ddbDocClient.send:', typeof ddbDocClient.send);

const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

module.exports = {
  async writeFragment(fragment) {
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Item: fragment,
    };

    const command = new PutCommand(params);

    try {
      logger.info(
        { TableName: params.TableName, fragmentId: fragment.id, ownerId: fragment.ownerId },
        'Writing fragment metadata to DynamoDB'
      );

      await ddbDocClient.send(command);
      return fragment;
    } catch (err) {
      logger.error({ err, params, fragment }, 'Error writing fragment to DynamoDB');
      throw err;
    }
  },

  async readFragment(ownerId, id) {
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Key: { ownerId, id },
    };

    const command = new GetCommand(params);

    try {
      logger.info({ TableName: params.TableName, ownerId, id }, 'Reading fragment metadata from DynamoDB');

      const data = await ddbDocClient.send(command);
      return data?.Item;
    } catch (err) {
      logger.error({ err, params }, 'Error reading fragment from DynamoDB');
      throw err;
    }
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

  async listFragments(ownerId, expand = false) {
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'ownerId = :ownerId',
      ExpressionAttributeValues: {
        ':ownerId': ownerId,
      },
    };

    if (!expand) {
      params.ProjectionExpression = 'id';
    }

    const command = new QueryCommand(params);

    try {
      logger.info(
        { TableName: params.TableName, ownerId, expand },
        'Listing fragments from DynamoDB'
      );

      const data = await ddbDocClient.send(command);

      return !expand ? data?.Items.map((item) => item.id) : data?.Items;
    } catch (err) {
      logger.error({ err, params }, 'Error listing fragments from DynamoDB');
      throw err;
    }
  },

  async deleteFragment(ownerId, id) {
    const dynamoParams = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Key: { ownerId, id },
    };

    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${ownerId}/${id}`,
    };

    const dynamoCommand = new DeleteCommand(dynamoParams);
    const s3Command = new DeleteObjectCommand(s3Params);

    try {
      logger.info(
        { TableName: dynamoParams.TableName, ownerId, id },
        'Deleting fragment metadata from DynamoDB'
      );
      await ddbDocClient.send(dynamoCommand);

      logger.info(
        { Bucket: s3Params.Bucket, Key: s3Params.Key },
        'Deleting fragment data from S3'
      );
      await s3Client.send(s3Command);
    } catch (err) {
      logger.error({ err, ownerId, id }, 'Error deleting fragment from DynamoDB/S3');
      throw err;
    }
  },
};