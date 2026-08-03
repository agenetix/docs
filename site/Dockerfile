# Multi-stage Dockerfile for the MCP Stack Docs site.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Skip lifecycle scripts until the full repo has been copied in the builder stage.
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:site

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app ./
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npx", "next", "start", "./site", "-H", "0.0.0.0", "-p", "3000"]
