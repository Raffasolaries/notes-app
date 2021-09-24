import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
// const REGION = "REGION"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({});
export { ddbClient };