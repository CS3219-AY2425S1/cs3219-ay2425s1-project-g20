FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build:common
RUN pnpm run build:services
RUN pnpm deploy --filter=@services/user-service --prod /prod/user-service
RUN pnpm deploy --filter=@services/question-service --prod /prod/question-service
RUN pnpm deploy --filter=@services/matching-service --prod /prod/matching-service

FROM base AS question-service
COPY --from=build /prod/question-service /prod/question-service
WORKDIR /prod/question-service
EXPOSE 3001
CMD ["pnpm", "start"]

FROM base AS user-service
COPY --from=build /prod/user-service /prod/user-service
WORKDIR /prod/user-service
EXPOSE 3002
CMD ["pnpm", "start"]

FROM base AS matching-service
COPY --from=build /prod/matching-service /prod/matching-service
WORKDIR /prod/matching-service
EXPOSE 3003
CMD ["pnpm", "start"]
