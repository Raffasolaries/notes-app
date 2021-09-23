import { constructAPIGwEvent } from "../../utils/helpers";
// Import all functions from get-by-id.js 
import { deleteNoteHandler } from '../../../src/handlers/delete-note'; 
// Import dynamodb from aws-sdk 
import { DocumentClient } from 'aws-sdk/clients/dynamodb'; 
 
// This includes all tests for getByIdHandler() 
describe('Test deleteNoteHandler', () => { 
 let deleteSpy: jest.SpyInstance; 
 // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
 beforeAll(() => { 
  // Mock dynamodb get and put methods 
  // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
  deleteSpy = jest.spyOn(DocumentClient.prototype, 'delete'); 
 }); 

 // Clean up mocks 
 afterAll(() => { 
  deleteSpy.mockRestore(); 
 }); 

 // This test invokes getByIdHandler() and compare the result  
 it('should delete note by id and category', async () => { 
  const item = { id: 'id1', category: 'cat1', text: 'this is an awesome note!!!' };

  // Return the specified value whenever the spied get function is called 
  deleteSpy.mockReturnValue({ 
   promise: () => Promise.resolve(item) 
  }); 

  const event = constructAPIGwEvent({}, { 
   requestContext: {
    routeKey: 'DELETE /{category}/{id}',
    http: {
     method: 'DELETE',
     path: '/cat1/id1'
    }
   },
   pathParameters: { 
    id: 'id1',
    category: 'cat1'
   } 
  });

  // Invoke getByIdHandler() 
  const result = await deleteNoteHandler(event); 

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