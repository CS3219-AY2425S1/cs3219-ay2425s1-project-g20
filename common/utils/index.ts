import dotenv from "dotenv";
import fs from 'fs';

export * from "./constants";

export function configEnv() {
  // https://v2.vitejs.dev/guide/env-and-mode.html#env-files
  let paths = [".env", ".env.local"];
  if (process.env.NODE_ENV !== undefined) {
    paths.push(
      `.env.${process.env.NODE_ENV}`,
      `.env.${process.env.NODE_ENV}.local`
    );
  }

  // https://www.npmjs.com/package/dotenv#options
  dotenv.config({
    path: paths,
    override: true,
  });
}

function readFromEnvPath(variableName: string): string {
  let path: string | undefined = process.env[variableName];
  if (path === undefined) {
    throw new Error(`Environment variable ${path} is not set!`);
  }

  let contents: string = fs.readFileSync(path, 'utf8');
  // Trim whitespace, such as trailing newlines
  return contents.trim();
}

export const getApiKey = () => readFromEnvPath("SERVICE_API_KEY_PATH");
export const getJwtSecret = () => readFromEnvPath("JWT_SECRET_PATH");
export const getGoogleAIApiKey = () => readFromEnvPath("GOOGLE_AI_API_KEY_PATH");
