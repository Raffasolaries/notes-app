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
  const item = { id: 'id1', category: 'cat1' };

  // Return the specified value whenever the spied get function is called 
  getSpy.mockReturnValue({ 
   promise: () => Promise.resolve({ Item: item }) 
  }); 

  const event = constructAPIGwEvent({}, { 
   httpMethod: 'GET', 
   pathParameters: { 
    id: 'id1',
    category: 'cat1'
   } 
  });

  // Invoke getByIdHandler() 
  const result = await getNoteHandler(event); 

  const expectedResult = { 
   statusCode: 200, 
   body: JSON.stringify(item) 
  }; 

  // Compare the result with the expected result 
  expect(result).toEqual(expectedResult); 
 }); 
}); 