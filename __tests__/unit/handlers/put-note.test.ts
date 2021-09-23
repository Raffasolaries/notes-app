import { constructAPIGwEvent } from "../../utils/helpers";
// Import all functions from put-item.js 
import { putNoteHandler } from '../../../src/handlers/put-note'; 
// Import sqs from aws-sdk
// import SQS from 'aws-sdk/clients/sqs';
import CustomSqsClient from '../../../src/utils/sqs';

// This includes all tests for putItemHandler() 
describe('Test putNoteHandler', function () { 
 let putSpy: jest.SpyInstance;
 // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
 beforeAll(() => { 
  // Mock SQS sendMessage method
  // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
  // We can't spy on SQS.prototype sendMessage method from aws-sdk and I don't understand why
  putSpy = jest.spyOn(CustomSqsClient.prototype, 'send');
 });

 // Clean up mocks 
 afterAll(() => { 
  putSpy.mockRestore(); 
 }); 

 // This test invokes putItemHandler() and compare the result  
 it('should add id and category to the SQS queue', async () => {
  putSpy.mockReturnValue(Promise.resolve({ MessageId: "5972648d-f5ec-4941-b1bc-1cd890982a22" }));

  const event = constructAPIGwEvent(
   { id: "id1", category: "cat1", text: 'This is an awesome note!!!' },
   {
    requestContext: {
     http: {
      method: 'POST',
      path: '/'
     }
    }
   },
  );

  // Invoke putItemHandler() 
  const result = await putNoteHandler(event); 

  // Compare the result with the expected result 
  expect(result.statusCode).toEqual(201);
  expect(JSON.parse(result.body)).toMatchObject({ MessageId: "5972648d-f5ec-4941-b1bc-1cd890982a22" });
  expect(putSpy).toHaveBeenCalled();
 }); 
}); 