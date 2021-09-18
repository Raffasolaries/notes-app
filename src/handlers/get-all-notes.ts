import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import * as R from 'rambda';
// Create clients and set shared const values outside of the handler.
import CustomDynamoClient from '../utils/dynamodb';

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getAllNotesHandler = async (
 event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
 if (event.httpMethod !== 'GET') {
  throw new Error(`getAllNotes only accept GET method, you tried: ${event.httpMethod}`);
 }
 // All log statements are written to CloudWatch
 console.info('received:', event);

 const client = new CustomDynamoClient();
 const items = await client.readAll();

 const response = {
  statusCode: R.isEmpty(items) ? 204 : 200,
  body: JSON.stringify(items)
 };

 // All log statements are written to CloudWatch
 console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
 return response;
}