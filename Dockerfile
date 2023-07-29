FROM node:20-slim as builder

WORKDIR /builder

COPY ./ ./

RUN npm ci

RUN npm run build

FROM node:20-slim as target

WORKDIR /app

COPY --from=builder /builder/dist /app/
COPY --from=builder /builder/package* /app/

RUN npm ci --omit dev

ENV LOG_ENABLED=true
ENV LOG_LEVEL=debug
ENV NODE_ENV=production

CMD ["/bin/bash", "-c", "node /app/server"]