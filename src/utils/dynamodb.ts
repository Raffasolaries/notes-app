// Create a DocumentClient that represents the query to add an item
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Note } from './interfaces';

// Declare some custom client just to illustrate how TS will include only used files into lambda distribution
export default class CustomDynamoClient {
 table: string;
 client: DynamoDB;
 docClient: DynamoDBDocument;

 constructor(table = process.env.DYNAMODB_TABLE) {
  this.client = new DynamoDB({});
  this.docClient = DynamoDBDocument.from(this.client);
  this.table = table || '';
 }

 async readAll() {
  const data = await this.docClient.scan({ TableName: this.table });
  console.info('returned items', data);
  return data.Items || [];
 }

 async read(id: string, category: string) {
  const params = {
   TableName : this.table,
   Key: { id: id, category: category },
  };
  const data = await this.docClient.get(params);
  return data.Item || {};
 }

 async write(Item: Note) {
  const params = {
   TableName: this.table,
   Item,
   ConditionExpression: "attribute_not_exists(id) and attribute_not_exists(category)"
  };
  return await this.docClient.put(params);
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
  return await this.docClient.update(params);
 }

 async delete(id: string, category: string) {
  const params = {
   TableName : this.table,
   Key: { id: id, category: category },
   ConditionExpression: "attribute_exists(id) and attribute_exists(category)"
  };
  return await this.docClient.delete(params);
 }
}