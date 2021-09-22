import 'source-map-support/register';
import {
 APIGatewayProxyEventV2,
 APIGatewayProxyResultV2
} from "aws-lambda";
import _ from 'lodash';
// Create clients and set shared const values outside of the handler.
import CustomDynamoClient from '../utils/dynamodb';

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getAllNotesHandler = async (
 event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
 if (event.requestContext.http.method !== 'GET') {
  throw new Error(`getAllNotes only accept GET method, you tried: ${event.requestContext.http.method}`);
 }
 // All log statements are written to CloudWatch
 console.info('received:', event);

 const client = new CustomDynamoClient();
 const items = await client.readAll();

 const response = {
  isBase64Encoded: false,
  statusCode: _.isEmpty(items) ? 204 : 200,
  body: JSON.stringify(items),
  headers: {
   "content-type": "application/json"
  }
 };

 // All log statements are written to CloudWatch
 console.info(`response from: ${event.requestContext.http.path} statusCode: ${response.statusCode} body: ${response.body}`);
 return response;
}