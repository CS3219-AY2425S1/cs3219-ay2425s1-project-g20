import dotenv from 'dotenv';

export function configEnv() {
  // https://v2.vitejs.dev/guide/env-and-mode.html#env-files
  let paths = [".env", ".env.local"];
  if (process.env.NODE_ENV !== undefined) {
    paths.push(`.env.${process.env.NODE_ENV}`, `.env.${process.env.NODE_ENV}.local`);
  }

  // https://www.npmjs.com/package/dotenv#options
  dotenv.config({
    path: paths,
    override: true
  });
}
