import { constructAPIGwEvent } from "../../utils/helpers";
// Import all functions from get-all-items.js 
import { getAllNotesHandler } from '../../../src/handlers/get-all-notes'; 
// Import dynamodb from aws-sdk 
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
 
// This includes all tests for getAllNotesHandler() 
describe('Test getAllNotesHandler', () => { 
 let sendSpy: jest.SpyInstance;
 // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
 beforeAll(() => { 
  // Mock dynamodb get and put methods 
  // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
  sendSpy = jest.spyOn(DynamoDBDocumentClient.prototype, 'send'); 
 }); 

 // Clean up mocks 
 afterAll(() => { 
  sendSpy.mockRestore(); 
 }); 

 it('should return ids', async () => { 
  const items = [{ id: 'id1', category: 'cat1', text: 'This is an awesome note!!!' }, { id: 'id2', category: 'cat2', text: 'Something to think about ...' }]; 

  // Return the specified value whenever the spied scan function is called 
  // sendSpy.mockReturnValue({ 
  //  promise: () => Promise.resolve({ Items: items }) 
  // }); 
  sendSpy.mockImplementationOnce(() => Promise.resolve({ Items: items }));

  const event = constructAPIGwEvent({}, {
   requestContext: {
    routeKey: 'GET /',
    http: {
     method: 'GET',
     path: '/'
    }
   }
  });

  // Invoke helloFromLambdaHandler() 
  const result = await getAllNotesHandler(event); 

  const expectedResult = {
   isBase64Encoded: false,
   statusCode: 200, 
   body: JSON.stringify(items),
   headers: {
    "content-type": "application/json"
   }
  }; 

  // Compare the result with the expected result 
  expect(result).toEqual(expectedResult); 
 }); 
}); 