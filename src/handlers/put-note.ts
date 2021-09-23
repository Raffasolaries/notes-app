import 'source-map-support/register';
import {
 APIGatewayProxyEventV2,
 APIGatewayProxyResultV2
} from "aws-lambda";

// Create clients and set shared const values outside of the handler.
import CustomSqsClient from '../utils/sqs';
import { Note } from '../utils/interfaces';
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putNoteHandler = async (
 event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
 if (event.requestContext.http.method !== 'POST') {
  throw new Error(`postMethod only accepts POST method, you tried: ${event.requestContext.http.method} method.`);
 }
 // All log statements are written to CloudWatch
 console.info('received:', event);

 // Get id and name from the body of the request
 const body: Note = JSON.parse(event.body || '{}');
 const id: string = body.id;
 const category: string = body.category;
 const text: string =  body.text;
 const action: string = 'put';

 const client = new CustomSqsClient();
 const result = await client.send({ id, category, text, action });

 const response = {
  isBase64Encoded: false,
  statusCode: 201,
  body: JSON.stringify({ MessageId: result.MessageId }),
  headers: {
   "content-type": "application/json"
  }
 };

 // All log statements are written to CloudWatch
 console.info(`response from: ${event.requestContext.http.path} statusCode: ${response.statusCode} body: ${response.body}`);
 return response;
}