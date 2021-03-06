import { constructAPIGwEvent } from "../../utils/helpers";
// Import all functions from get-by-id.js 
import { getNoteHandler } from '../../../src/handlers/get-note'; 
// Import dynamodb from aws-sdk
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'; 
import { callbackify } from "util";
 
// This includes all tests for getByIdHandler() 
describe('Test getNoteHandler', () => { 
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

 // This test invokes getByIdHandler() and compare the result  
 it('should get note by id and category', async () => { 
  const item = { id: 'id1', category: 'cat1', text: 'this is an awesome note!!!' };

  // Return the specified value whenever the spied get function is called 
  // sendSpy.mockReturnValue({ 
  //  promise: () => Promise.resolve({ Item: item }) 
  // });
  sendSpy.mockImplementationOnce(() => Promise.resolve({ Item: item }));

  const event = constructAPIGwEvent({}, { 
   requestContext: {
    routeKey: 'GET /{category}/{id}',
    http: {
     method: 'GET',
     path: '/cat1/id1'
    }
   }, 
   pathParameters: { 
    id: 'id1',
    category: 'cat1'
   } 
  });

  // Invoke getByIdHandler() 
  const result = await getNoteHandler(event); 

  const expectedResult = {
   isBase64Encoded: false,
   statusCode: 200, 
   body: JSON.stringify(item),
   headers: {
    "content-type": "application/json"
   }
  }; 

  // Compare the result with the expected result 
  expect(result).toEqual(expectedResult); 
 }); 
}); 