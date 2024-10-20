# Matching Service

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development)

1. Ensure that you have a container for Redis set up on Docker, exposing the port 6379
2. Run `pnpm run dev` to run the dev script.

## Documentation

### Environment variables

`.env`:

- `PORT` (optional): Port to run the service on.
- `CORS_ORIGINS` (optional): Allow list for CORS, as parseable JSON.
- `USER_SERVICE_URL`: The URL to the user service.