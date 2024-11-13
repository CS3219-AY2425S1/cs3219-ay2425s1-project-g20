// Adapted from https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
interface ImportMetaEnv {
  readonly VITE_QUESTION_SERVICE_API_URL: string;
  readonly VITE_USER_SERVICE_API_URL: string;
  readonly VITE_MATCH_SERVICE_API_URL: string;
  readonly VITE_COLLABORATION_SERVICE_WS_URL: string;
  readonly VITE_COLLABORATION_SERVICE_API_URL: string;
  readonly VITE_CHAT_SERVICE_WS_URL: string;
  readonly VITE_AI_SERVICE_API_URL: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
