#!/bin/bash

set -e

echo "Setting AWS environment variables for LocalStack"
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-2

S3_ENDPOINT="http://localhost:4566"
DDB_ENDPOINT="http://localhost:8000"
BUCKET_NAME="fragments"
TABLE_NAME="fragments"

echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
echo "AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION"

echo "Waiting for LocalStack S3..."
until aws --endpoint-url=$S3_ENDPOINT s3api list-buckets > /dev/null 2>&1; do
  sleep 2
done
echo "LocalStack S3 Ready"

echo "Creating LocalStack S3 bucket: $BUCKET_NAME"
aws --endpoint-url=$S3_ENDPOINT s3api create-bucket \
  --bucket $BUCKET_NAME \
  --create-bucket-configuration LocationConstraint=$AWS_DEFAULT_REGION || true

echo "Waiting for DynamoDB Local..."
until aws --endpoint-url=$DDB_ENDPOINT dynamodb list-tables > /dev/null 2>&1; do
  sleep 2
done
echo "DynamoDB Local Ready"

echo "Creating DynamoDB-Local DynamoDB table: $TABLE_NAME"
aws --endpoint-url=$DDB_ENDPOINT dynamodb create-table \
  --table-name $TABLE_NAME \
  --attribute-definitions AttributeName=ownerId,AttributeType=S AttributeName=id,AttributeType=S \
  --key-schema AttributeName=ownerId,KeyType=HASH AttributeName=id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST || true