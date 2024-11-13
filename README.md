[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)

# CS3219 Project (PeerPrep) - AY2425S1

**Group: G20**

This is the monorepo for our PeerPrep implementation.

## Development Instructions

### Terminology

- Monorepo root: The root folder in which you have cloned the monorepo.
- Service root: The root folder of a particular service.\
  e.g. the question service's root is at `services/question/` relative to the monorepo root.

Unless otherwise specified, commands should be run in the monorepo root.

### Pre-requisites

- [Node.js](https://nodejs.org/en) V19 or greater
- [Docker](https://docs.docker.com/get-started/get-docker/)
- [`pnpm`](https://pnpm.io/installation)
  - On Windows, run `npm i -g pnpm` to install it.

### First-time setup

1. Run `pnpm i` to install all dependencies.
   - You do not need to install dependencies individually within subfolders.
1. You would have been provided a JSON file containing Firebase service account credentials.\
   Place it in `.firebase/service-account.json`.
1. Make a copy of `jwt_secret.example` and name it `jwt_secret.txt`. Change its contents for security reasons.
   - This is used to sign user ID payloads into JSON Web Token strings, and later verify them to get back the decoded tokens.
1. Make a copy of `service_api_key.example` and name it `service_api_key.txt`. Change its contents for security reasons.
   - This is used to secure internal communications between services.

**Only** if the questions database has yet to be initialised and is thus empty:

1. Navigate to the question service's root and run `pnpm run upload` to populate it.

If a new admin user account is required:

1. Make a copy of `services/user/.env.development.local.example` and name it `services/user/.env.development.local`. Change the sample account details as desired.
1. Navigate to the user service's root and run `pnpm run create-admin` to create the account.

### Running the project (development)

1. Run `docker compose up -d redis`.
   - This starts a Docker container for Redis, in a detached state (running in the background). This is required by the matching service.
1. Run `pnpm dev` to run the dev script.
   - This starts the frontend and all services in dev mode.
1. Open your browser at <http://localhost:3000>.

### Running the project (production)

1. Run `docker compose up -d`.
   - This starts Docker containers for all services, including containers those services depend on, in a detached state.
1. Run `pnpm dev:frontend` to run the frontend's dev script.
1. Open your browser at <http://localhost:3000>.

### Troubleshooting

#### "An attempt was made to access a socket in a way forbidden by its access permissions"

The following error may be encountered when attempting to `docker compose up` on Windows:

```
Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:3001 -> 0.0.0.0:0: listen tcp 0.0.0.0:3001: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

It may be related to `WinNAT` holding up the port in question, so restarting it may resolve the issue.

Open an **administrator** command prompt and run:

```shell
net stop winnat
net start winnat
```

### Managing dependencies

We use `pnpm` as our package manager, which handles nested dependencies. Do not use `npm` to add dependencies; there should be no `package-lock.json` files generated.

For example, to add `jest` to the user service, as a dev dependency:

```shell
pnpm add jest -F @services/user-service -D
```

The [`-F` filter](https://pnpm.io/cli/add#--filter-package_selector) is based on _package name_, i.e. the name of the service in `package.json`. It is not based on workspace name.

## Documentation

### Env files

Throughout the monorepo, the env file design mirrors that of [Vite](https://v2.vitejs.dev/guide/env-and-mode.html#env-files), which we use for our frontend.

We check in `.env`, and optionally `.env.[NODE_ENV]` as needed.

We **do not** check in `.env.local` and any `.env.[NODE_ENV].local` files. Secrets should only be contained in such local files and should never be checked in at any point. Example local env files, appended with `.example`, can be found in the repo containing sample values.

In the case of duplicate variables, the priority is as follows with later files overwriting earlier files' variables: `.env` < `.env.local` < `.env.[NODE_ENV]` < `.env.[NODE_ENV].local`.

## Acknowledgements

Mantine: <https://v6.mantine.dev/>
Mantine UI: <https://ui.mantine.dev/>
