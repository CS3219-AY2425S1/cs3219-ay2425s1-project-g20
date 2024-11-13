# Question Service

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development)

1. Run `pnpm dev` to run the dev script.
1. Open your browser at <http://localhost:3001>.

### Running tests

1. Run `pnpm test` to run the test script.

## Documentation

### Environment variables

`.env`:

- `PORT` (optional): Port to run the service on.
- `CORS_ORIGINS` (optional): Allow list for CORS, as parseable JSON.
- `USER_SERVICE_URL`: The URL to the user service.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account credentials file for Firestore.
- `COLLECTION_NAME` (optional): Name of the collection to use in Firestore.
- `SERVICE_API_KEY_PATH`: Path to the file containing the API key for our services.

### Tests

**Jest** is used for testing.

Tests are stored in the `src/__tests__/` folder. Its hierarchy mirrors that of `src/`, with `.test` prepended before the file extension.\
e.g. the tests for `src/controller/controller.ts` are in `src/__tests__/controller/controller.test.ts`.


### Database client

- The database client is defined in `./src/db/clients.ts`. It connects to Google Cloud Datastore (Firestore).
- Connecting to Firestore requires service account credentials file. The path to the file must be set in the environment variable `GOOGLE_APPLICATION_CREDENTIALS`.
- The client looks for the `COLLECTION_NAME` environment variable to determine the collection name to use in Firestore.

### Sample data

Sample data can be found in `data/questions.json`. It is used by the `upload` script for populating the database.

### API

- `POST /questions`: Create a new question.
- `GET /questions`: Get all questions. If `complexity` or `categories` are stated in the request body, questions returned will be filtered according to the fields specified.
- `GET /questions/:id`: Get a question by ID.
- `PUT /questions/:id`: Update a question by ID.
- `DELETE /questions/:id`: Delete a question by ID

All routes require `Authorization: Bearer <JWT_ACCESS_TOKEN>`. Only admin accounts are able to perform create, update and delete operations.
