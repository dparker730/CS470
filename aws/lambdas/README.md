# LAFS AWS Lambdas

Node.js 20.x handlers from CS 470 Module 5. They talk to DynamoDB tables `Question` and `Answer`.

CORS headers are returned on every response so the Angular app on S3 can call API Gateway.

| Function | DynamoDB call | Notes |
| --- | --- | --- |
| TableScan | `Scan` + optional `FilterExpression` | Lists Questions or Answers. If `include.relation` is `answers`, runs a nested scan on `Answer` by `questionId`. |
| GetSingleRecord | `GetItem` | Table name comes from the resource path (`/Questions/{id}` or `/Answers/{id}`). |
| FindOneQuestion | `Scan`, first item | Used by Angular `findOne` (slug lookup). Attaches answers the same way TableScan does. |
| UpsertQuestion | `UpdateItem` | POST creates a uuid `id`. PUT updates an existing item. Package with `npm install` and zip before upload. |
| UpsertAnswer | `UpdateItem` | Same pattern; PUT reads `id` from `pathParameters`. |
| DeleteRecord | `DeleteItem` | Shared by both tables. |

API Gateway was a REST API named **Questions & Answers**, stage `api`, Lambda proxy integration, region `us-east-1`. OPTIONS methods were Mock integrations that returned CORS headers.
