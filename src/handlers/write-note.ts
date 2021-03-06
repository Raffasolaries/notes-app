
import 'source-map-support/register';
import { SQSEvent } from 'aws-lambda';

// Create clients and set shared const values outside of the handler.
import CustomDynamoClient from '../utils/dynamodb';
import { Note } from '../utils/interfaces';

/**
 * A simple example includes a SQS queue listener to untie HTTP POST API from “heavy” write to DB.
 */
export const writeNoteHandler = async (
 event: SQSEvent,
) => {
 console.info('Received from SQS:', event);

 for (const record of event.Records) {
  const body = JSON.parse(record.body);
  const item: Note = { id: body.id, category: body.category, text: body.text };

  const client = new CustomDynamoClient();

  if (body.action === 'put')
  {
   try
   {
    await client.write(item);
    console.info('Written to DynamoDB:', item);
   }
   catch (e)
   {
    console.error('DynamoDB write error', e);
   }
  }
  else if (body.action === 'update') 
  {
   try
   {
    await client.update(item);
    console.info('Updated to DynamoDB:', item);
   }
   catch (e)
   {
    console.error('DynamoDB update error', e);
   }
  }
  else
  {
   console.info('DynamoDB no available action found');
  }
 }
}