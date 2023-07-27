FROM node:16-slim as builder

WORKDIR /builder

COPY ./ ./

RUN npm ci
RUN npx prisma generate --schema=./server/prisma/schema.prisma
RUN npm run build

FROM node:lts-slim as target

WORKDIR /app

COPY --from=builder /builder/dist /app/
COPY --from=builder /builder/package* /app/
COPY ./server/prisma ./server/prisma

RUN npm ci --omit dev
RUN npx prisma generate

ENV LOG_ENABLED=true
ENV LOG_LEVEL=debug
ENV LOGGER_NAME=fridgy

CMD ["/bin/bash", "-c", "npm run prisma:deploy; node /app/server"]