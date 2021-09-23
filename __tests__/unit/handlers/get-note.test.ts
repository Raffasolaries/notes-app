import { constructAPIGwEvent } from "../../utils/helpers";
// Import all functions from get-by-id.js 
import { getNoteHandler } from '../../../src/handlers/get-note'; 
// Import dynamodb from aws-sdk 
import { DocumentClient } from 'aws-sdk/clients/dynamodb'; 
 
// This includes all tests for getByIdHandler() 
describe('Test getNoteHandler', () => { 
 let getSpy: jest.SpyInstance; 
 // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
 beforeAll(() => { 
  // Mock dynamodb get and put methods 
  // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
  getSpy = jest.spyOn(DocumentClient.prototype, 'get'); 
 }); 

 // Clean up mocks 
 afterAll(() => { 
  getSpy.mockRestore(); 
 }); 

 // This test invokes getByIdHandler() and compare the result  
 it('should get note by id and category', async () => { 
  const item = { id: 'id1', category: 'cat1', text: 'this is an awesome note!!!' };

  // Return the specified value whenever the spied get function is called 
  getSpy.mockReturnValue({ 
   promise: () => Promise.resolve({ Item: item }) 
  }); 

  const event = constructAPIGwEvent({}, { 
   requestContext: {
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