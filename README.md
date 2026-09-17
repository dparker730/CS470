# CS 470 — LAFS cloud migration

SNHU CS-470 project: a MEAN-stack Q&A app (Learn Angular From Scratch) that was containerized with Docker, then migrated to AWS serverless.

The original Academy lab is gone. This repo rebuilds the **local Docker stack** and keeps the **Lambda source** so the serverless backend can be redeployed in a new AWS account.

## What the app does

Angular 7 Q&A site with three screens:

| Route | Screen | Data |
| --- | --- | --- |
| `/` | Category cards | `lafs-web/src/assets/categories.json` |
| `/questions/about/:categorySlug` | Questions in a category | REST `/Questions` |
| `/question/:questionSlug` | Question plus answers | REST `/Questions/findOne` |

Categories are static. Questions and answers are CRUD resources with up/down votes.

## Architecture

**Local (this rebuild)**

```
Browser → lafs-web (Angular :4200)
        → lafs-api (LoopBack :3000) → MongoDB 4 (:27017)
```

**AWS (Project One, original lab)**

```
Browser → S3 static site (parkercs470)
        → API Gateway → 6 Lambdas → DynamoDB (Question, Answer)
```

The Angular client kept the LoopBack SDK. API Gateway and Lambda were shaped to match the REST calls that SDK already made.

## Run locally

Docker Desktop must be running.

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:4200
- API explorer: http://localhost:3000/explorer

Stop with `Ctrl+C`, or `docker compose down`.

The compose file starts three containers on an internal `lafs-net` bridge. The API receives `DB_HOST=mongo` and `DB_NAME=lafs-db`.

## Repo layout

```
lafs-web/          Angular 7 frontend
lafs-api/          LoopBack 3 REST API + Mongo connector
aws/lambdas/       Module 5 handlers (Node.js 20 / AWS SDK v3)
mod 1–7/           Course screenshots and write-ups
docs/              Course reflection
docker-compose.yml Local full stack
```

## Serverless backend

Lambda source is in `aws/lambdas/`. Mapping used in Project One:

| Resource | GET | POST | PUT | DELETE |
| --- | --- | --- | --- | --- |
| `/Questions` | TableScan | UpsertQuestion | UpsertQuestion | — |
| `/Questions/{id}` | GetSingleRecord | — | UpsertQuestion | DeleteRecord |
| `/Questions/findOne` | FindOneQuestion | — | — | — |
| `/Answers` | TableScan | UpsertAnswer | UpsertAnswer | — |
| `/Answers/{id}` | GetSingleRecord | — | UpsertAnswer | DeleteRecord |

`UpsertQuestion` and `UpsertAnswer` need the `uuid` package (and the AWS SDK v3 clients). Deploy those two from a zip that includes `node_modules`. The others were pasted into the Lambda console.

DynamoDB tables:

- `Question` — partition key `id` (string): `categorySlug`, `questionSlug`, `question`, `negativeVotes`, `positiveVotes`
- `Answer` — partition key `id` (string): `questionId`, `answer`, `negativeVotes`, `positiveVotes`

Mongo `hasMany` / `include` became a nested `Scan` in `TableScan` and `FindOneQuestion` because DynamoDB has no joins.

## Course path

1. MongoDB in Docker
2. Containerize Angular and LoopBack, then Compose the stack
3. Host the Angular production build on S3
4. Practice Lambda + API Gateway (`EchoFunction`)
5. DynamoDB tables + CRUD Lambdas
6. Project One: wire the Angular app to API Gateway
7. Project Two: architecture presentation

Reflection from the original GitHub README: [docs/course-reflection.md](docs/course-reflection.md)
