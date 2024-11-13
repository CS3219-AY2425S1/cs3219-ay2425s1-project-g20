# Matching Service

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development)

1. Run `docker compose up -d redis`.
    - This starts a Docker container for Redis, in a detached state.
1. Run `pnpm dev` to run the dev script.

## Documentation

### Environment variables

`.env`:

- `PORT` (optional): Port to run the service on.
- `CORS_ORIGINS` (optional): Allow list for CORS, as parseable JSON.
- `REDIS_URL` (optional): The URL for this service's Redis.
- `USER_SERVICE_URL`: The URL to the user service.
- `COLLABORATION_SERVICE_URL`: The URL to the collaboration service.
- `SERVICE_API_KEY_PATH`: Path to the file containing the API key for our services.
