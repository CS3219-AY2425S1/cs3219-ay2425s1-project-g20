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
- `USER_SERVICE_URL`: The URL to the user service.
- `GOOGLE_AI_API_KEY`: The API key for the Google AI gemini service.