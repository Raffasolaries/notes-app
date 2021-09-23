import 'source-map-support/register';
import {
 APIGatewayProxyEventV2,
 APIGatewayProxyStructuredResultV2
} from "aws-lambda";

// Create clients and set shared const values outside of the handler.
import CustomSqsClient from '../utils/sqs';
import { ValidateNote } from '../utils/interfaces';
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const updateNoteHandler = async (
 event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
 if (event.requestContext.http.method !== 'PUT') {
  throw new Error(`putMethod only accepts PUT method, you tried: ${event.requestContext.http.method} method.`);
 }
 // All log statements are written to CloudWatch
 console.info('received:', event);

 // Get id and name from the body of the request
 const body = JSON.parse(event.body || '{}');
 if (!ValidateNote(body)){
  return {
   isBase64Encoded: false,
   statusCode: 400,
   body: JSON.stringify({ errors: ValidateNote.errors }),
   headers: {
    "content-type": "application/json"
   }
  };
 }
 const id = body.id;
 const category = body.category;
 const text =  body.text;
 const action = 'update';

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