FROM node:20-alpine
WORKDIR /app

# Install deps via workspace manifests (avoids copying all source first)
COPY package*.json ./
COPY packages/schema/package.json packages/schema/
COPY ingestion-api/package.json ingestion-api/
RUN npm install

# Copy source (overridden by volume mounts in docker-compose for local dev)
COPY packages/schema packages/schema
COPY ingestion-api ingestion-api

WORKDIR /app/ingestion-api
EXPOSE 3000
CMD ["npx", "tsx", "watch", "src/local.ts"]
