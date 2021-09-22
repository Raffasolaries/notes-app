import 'source-map-support/register';
import {
 APIGatewayProxyEventV2,
 APIGatewayProxyResultV2
} from "aws-lambda";
import _ from 'lodash';
// Create clients and set shared const values outside of the handler.
import CustomDynamoClient from '../utils/dynamodb';

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
export const deleteNoteHandler = async (
 event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
 if (event.requestContext.http.method !== 'DELETE') {
  throw new Error(`deleteMethod only accept DELETE method, you tried: ${event.requestContext.http.method}`);
 }
 // All log statements are written to CloudWatch
 console.info('received:', event);

 // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
 const id = (event.pathParameters || {}).id || '';
 const category = (event.pathParameters || {}).category || '';

 const client = new CustomDynamoClient();
 let output: any;
 let response: APIGatewayProxyResultV2;
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
  console.info(`response from: ${event.requestContext.http.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
 }

 response = {
  isBase64Encoded: false,
  statusCode: 200,
  body: JSON.stringify(output)
 };

 // All log statements are written to CloudWatch
 console.info(`response from: ${event.requestContext.http.path} statusCode: ${response.statusCode} body: ${response.body}`);
 return response;
}