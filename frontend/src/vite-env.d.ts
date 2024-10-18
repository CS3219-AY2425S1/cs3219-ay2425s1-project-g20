// Adapted from https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
interface ImportMetaEnv {
  readonly VITE_QUESTION_SERVICE_API_URL: string;
  readonly VITE_USER_SERVICE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
