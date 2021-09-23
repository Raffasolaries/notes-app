import { APIGatewayProxyEventV2, SQSEvent } from 'aws-lambda';

export function constructAPIGwEvent(message: any, options: Record<string, any> = {}): APIGatewayProxyEventV2 {
 return {
  version: '2.0',
  routeKey: '$default',
  rawPath: ((options.requestContext || {}).http || {}).path || '/',
  rawQueryString: 'parameter1=value1&parameter1=value2&parameter2=value',
  cookies: options.cookies || [],
  requestContext: options.requestContext || {},
  queryStringParameters: options.query || {},
  headers: options.headers || {},
  body: options.rawBody || JSON.stringify(message),
  isBase64Encoded: false,
  pathParameters: options.pathParameters || {},
  stageVariables: options.stageVariables || {}
 }
}

export function constructSQSEvent(message: any): SQSEvent {
 return {
  Records: [
   {
    messageId: "d90fd5a5-fd9e-4ab0-979b-97a1e70c9587",
    receiptHandle: "AQEB3Z4KHgpG7c/PG+QzcQ8+lfkZTtoS902r67GNes0Oo4JvcaEzkpTYoUzWTtbkhwbrJcxX36YvNW73oJXiNRnZjKHMkv9348JwBfLc9ES32IrK7w2RTXJ+Odl1mMIJCnuYGaiM61HxymbBRn3MmDHiOHqPytTwYSUNsZWP+OZRWncmPTBjyqrdq1/bItRLAtIM02WR6r3S+YyjCYLO0kKlYs0g4JZAEJ7CD8VXvDJnuDTBFPGv+5a9HaJRsxwF1LdksC5YYdEQ7uScKHm0gZFGLHyifN6S2J3x6vzooSR72gmUx1Bu43U3yu2arbwbykaO+40NjfsxK/Z43cXStWIlV+V7ZX5kJ9YTpqkOKujZtmZ4fYZXcns/WYEiwuw9eoPFaSMdVJyFCPScNlsGvfcHc8IkjXC0TbhV68XJYb7eR6Y=",
    body: JSON.stringify(message),
    attributes: {
     ApproximateReceiveCount: "1",
     SentTimestamp: "1602074535529",
     SenderId: "123456789012",
     ApproximateFirstReceiveTimestamp: "1602074535540"
    },
    messageAttributes: {},
    md5OfBody: "033bd94b1168d7e4f0d644c3c95e35bf",
    eventSource: "aws:sqs",
    eventSourceARN: "arn:aws:sqs:us-east-1:123456789012:WriteQueue-KJAGRBTIIB1Y",
    awsRegion: "eu-west-1"
   }
  ]
 }
}
