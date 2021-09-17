
import { constructSQSEvent } from "../../utils/helpers";
// Import all functions from put-item.js
import { writeNoteHandler } from '../../../src/handlers/write-note';
// Import dynamodb from aws-sdk
import dynamodb from 'aws-sdk/clients/dynamodb';

// This includes all tests for putItemHandler()
describe('Test writeItemHandler', function () {
 let writeSpy;

 // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
 beforeAll(() => {
  // Mock dynamodb get and put methods
  // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
  writeSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
 });

 // Clean up mocks
 afterAll(() => {
  writeSpy.mockRestore();
 });

 // This test invokes putItemHandler() and compare the result
 it('should add id and category to the table', async () => {
  const returnedItem = { id: 'id1', category: 'cat1' };

  // Return the specified value whenever the spied put function is called
  writeSpy.mockReturnValue({
   promise: () => Promise.resolve(returnedItem)
  });

  const event = constructSQSEvent(
   { id: "id1", name: "cat1" },
  );

  await writeNoteHandler(event);

  expect(writeSpy).toHaveBeenCalled();
 });
});