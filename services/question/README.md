# Question Service

Question service for PeerPrep.

## Database client

- The database client is defined in `./src/db/clients.ts`. It connects to Google Cloud Datastore (Firestore).
- Connecting to Firestore requires service account credentials file. The path to the file must be set in the environment variable `GOOGLE_APPLICATION_CREDENTIALS`.
- The client looks for the `COLLECTION_NAME` environment variable to determine the collection name to use in Firestore.

## Environment variables

- `PORT` (optional): Port to run the service on. Defaults to `3000` as per `index.ts`.
- `COLLECTION_NAME` (optional): Name of the collection in Firestore to use. Defaults to `questions` as per `clients.ts`.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account credentials file for Firestore.
- `CORS_ORIGINS` (optional): Allow list for CORS, as parseable JSON, e.g. `'["http://localhost:3000", "http://localhost:3001"]'`. Defaults to `'*'` as per `index.ts`.

To use `.env.development` or `.env.production`, set the `NODE_ENV` to `development` or `production` and put this code on top of the entry file:

```typescript
import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}
```

## Routes

All routes start with `/questions` as the base route.

- `POST /questions`: Create a new question.
- `GET /questions`: Get all questions. If `complexity` or `categories` are stated in the request body, questions returned will be filtered according to the fields specified.
- `GET /questions/:id`: Get a question by ID.
- `PUT /questions/:id`: Update a question by ID.
- `DELETE /questions/:id`: Delete a question by ID

## Database schema

`src/model.ts`

## Example data

Sample data can be found in `data/questions.json`.

## Tests

**Jest** is used for testing.

Tests are stored in the `src/__tests__/` folder. Its hierarchy mirrors that of `src/`, with `.test` prepended before the file extension.\
e.g. the tests for `src/controller/questions-controller.ts` are in `src/__tests__/controller/questions-controller.test.ts`.

---

# Development Instructions

## First-time setup

1. If you haven't yet installed the monorepo's dependencies, open a command line in the root folder and run `pnpm i`. If you don't have `pnpm`, on Windows, first run `npm i -g pnpm` to install it.
1. Ensure you have a copy of the provided Firebase service account credentials JSON file. Place it in a location of your choosing.\
  Developers may opt to place it outside the cloned monorepo's folder to ensure it never gets accidentally checked in.
1. Make a copy of `.env.development.example` and name it `.env.development`. Edit the contents as necessary, such as specifying the actual path to your Firebase JSON file.

If the database has yet to be initialised and is thus empty, additionally run `npm run upload` to populate it.

## Running the service (development)

1. Open a command line and navigate to the root folder of `services/question/` (e.g. `cd services/question`).
1. Run `npm run dev` to run the dev script.
1. Open your browser at <http://localhost:3000> (assuming your `.env.development` file has `PORT=3000`).\
  Edit the URL to work with different routes. For example, you can open <http://localhost:3000/questions> to get all questions.

## Running tests

1. Open a command line and navigate to the root folder of `services/question/`.
1. Run `npm test` to run the test script.
