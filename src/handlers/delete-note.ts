import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import _ from 'lodash';
// Create clients and set shared const values outside of the handler.
import CustomDynamoClient from '../utils/dynamodb';

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
export const deleteNoteHandler = async (
 event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
 if (event.httpMethod !== 'DELETE') {
  throw new Error(`deleteMethod only accept DELETE method, you tried: ${event.httpMethod}`);
 }
 // All log statements are written to CloudWatch
 console.info('received:', event);

 // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
 const id = (event.pathParameters || {}).id || '';
 const category = (event.pathParameters || {}).category || '';

 const client = new CustomDynamoClient();
 let output: any;
 let response: APIGatewayProxyResult;
 try
 {
  output = await client.delete(id, category);
 }
 catch (e: any)
 {
  console.error(`error occurred`, e);
  response = {
   statusCode: 406,
   body: JSON.stringify({ message: e.errorMessage })
  };
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
 }

 response = {
  statusCode: 200,
  body: JSON.stringify(output)
 };

 // All log statements are written to CloudWatch
 console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
 return response;
}