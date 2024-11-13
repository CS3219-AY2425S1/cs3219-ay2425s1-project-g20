# Collaboration Service

A service to connect users with live collaboration sessions.

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development)

1. Run `pnpm dev` to run the dev script.

## Documentation

### Environment Variables

`.env`:

- `PORT` (optional): Port to run the service on.
- `CORS_ORIGINS` (optional): Allow list for CORS, as parseable JSON.
- `QUESTION_SERVICE_URL`: The URL to the question service.
- `USER_SERVICE_URL`: The URL to the user service.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account credentials file for Firestore.
- `COLLECTION_NAME` (optional): Name of the collection to use in Firestore.
- `SERVICE_API_KEY_PATH`: Path to the file containing the API key for our services.
