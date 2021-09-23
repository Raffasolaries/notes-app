
import { constructSQSEvent } from "../../utils/helpers";
// Import all functions from put-item.js
import { writeNoteHandler } from '../../../src/handlers/write-note';
// Import dynamodb from aws-sdk
import dynamodb from 'aws-sdk/clients/dynamodb';

// This includes all tests for putItemHandler()
describe('Test writeNoteHandler', function () {
 let writeSpy: jest.SpyInstance;
 let updateSpy: jest.SpyInstance;
 // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
 beforeAll(() => {
  // Mock dynamodb get and put methods
  // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
  writeSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
  updateSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'update');
 });

 // Clean up mocks
 afterAll(() => {
  writeSpy.mockRestore();
  updateSpy.mockRestore();
 });

 // This test invokes putItemHandler() and compare the result
 it('should put note to the table', async () => {
  const returnedItem = { id: 'id1', category: 'cat1', text: 'This is an awesome note!!!' };

  // Return the specified value whenever the spied put function is called
  writeSpy.mockReturnValue({
   promise: () => Promise.resolve(returnedItem)
  });

  const event = constructSQSEvent(
   { id: "id1", category: "cat1", text: 'This is an awesome note!!!', action: 'put' },
  );

  await writeNoteHandler(event);

  expect(writeSpy).toHaveBeenCalled();
 });

 // This test invokes putItemHandler() and compare the result
 it('should update note in the table', async () => {
  const returnedItem = { id: 'id1', category: 'cat1', text: 'This is an awesome note!!!' };

  // Return the specified value whenever the spied put function is called
  updateSpy.mockReturnValue({
   promise: () => Promise.resolve(returnedItem)
  });

  const event = constructSQSEvent(
   { id: "id1", category: "cat1", text: 'This is an awesome note!!!', action: 'update' },
  );
  process.env.DYNAMOBB_TABLE = 'Notes';
  await writeNoteHandler(event);

  expect(updateSpy).toHaveBeenCalled();
 });
});