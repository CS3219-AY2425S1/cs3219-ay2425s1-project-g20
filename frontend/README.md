# Frontend

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development)

1. Run `pnpm dev` to run the dev script.
1. Open your browser at <http://localhost:3000>.

## Documentation

### Environment Variables

`.env`:

- `VITE_QUESTION_SERVICE_API_URL`: The URL to the question service.
- `VITE_USER_SERVICE_API_URL`: The URL to the user service.
- `VITE_MATCH_SERVICE_API_URL`: The URL to the matching service websocket.
- `VITE_COLLABORATION_SERVICE_WS_URL`: The URL to the collaboration service websocket.
- `VITE_COLLABORATION_SERVICE_API_URL`: The URL to the collaboration service.
- `VITE_AI_SERVICE_API_URL`: The URL to the AI copilot service.

For more details on how `.env` works in Vite:
<https://vitejs.dev/guide/env-and-mode>
