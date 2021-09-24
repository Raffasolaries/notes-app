// Create a DocumentClient that represents the query to add an item
import { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./libs/ddbDocClient";
import { Note } from './interfaces';

// Declare some custom client just to illustrate how TS will include only used files into lambda distribution
export default class CustomDynamoClient {
 table: string;

 constructor(table = process.env.DYNAMODB_TABLE) {
  this.table = table || '';
 }

 async readAll() {
  const data = await ddbDocClient.send(new ScanCommand({ TableName: this.table }));
  console.info('returned items', data);
  return data.Items || [];
 }

 async read(id: string, category: string) {
  const params = {
   TableName : this.table,
   Key: { id: id, category: category },
  };
  const data = await ddbDocClient.send(new GetCommand(params));
  return data.Item || {};
 }

 async write(Item: Note) {
  const params = {
   TableName: this.table,
   Item,
   ConditionExpression: "attribute_not_exists(id) and attribute_not_exists(category)"
  };
  return await ddbDocClient.send(new PutCommand(params));
 }

 async update(Item: Note) {
  const params = {
   TableName: this.table,
   Key: {
    id: Item.id,
    category: Item.category
   },
   UpdateExpression: "SET #txt = :txt",
   ExpressionAttributeValues: {
    ":txt": Item.text
   },
   ExpressionAttributeNames: {
    "#txt": "text"
   },
   ConditionExpression: "attribute_exists(id) and attribute_exists(category)"
  };
  return await ddbDocClient.send(new UpdateCommand(params));
 }

 async delete(id: string, category: string) {
  const params = {
   TableName : this.table,
   Key: { id: id, category: category },
   ConditionExpression: "attribute_exists(id) and attribute_exists(category)"
  };
  return await ddbDocClient.send(new DeleteCommand(params));
 }
}