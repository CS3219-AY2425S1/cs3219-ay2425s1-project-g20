# CS3219 Microservice template with Express.js
This is a simple microservice template with Express.js. It is meant to be used as a starting point for building microservices with Express.js.

## Packages
- `express`: Web framework for Node.js
- `ts-node` and `ts-node-dev`: TypeScript execution engine, transforms TypeScript into JavaScript, enabling you to directly execute TypeScript on Node.js without precompiling
- `jest`: Testing framework
- `dotenv` and `cross-env`: Environment variable loader
- `winston`: Logging library

## Scripts
Use `npm run <script>` or `yarn <script>` to run available scripts in `package.json`.

**Window users**: If you encounter this error: `'NODE_ENV' is not recognized as an internal or external command, operable program or batch file.`, add `cross-env` before every `NODE_ENV`. The `dev` and `test` scripts have been updated to use `cross-env`.

- `dev`: Start the server in development mode, with hot reloading (`ts-node-dev`) enabled

- `build`: Build the project. It cleans `package-lock.json` and reinstall dependencies before compiling TypeScript files.

- `start`: Start the server in production mode

- `test`: Run tests with Jest

## Logger
This template uses `winston` as the logging library. The logger is configured in `src/utils/logger.ts`.
