# Vritta website + astrologer portal for Cloud Run.
#
#   gcloud run deploy front-end --source . --region asia-south1 --allow-unauthenticated
#
# Build and run use the same Node image, so native packages (sharp for
# next/image) match at runtime.

# ---------- Build ----------
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* values are built into the browser JavaScript, so they must
# be set here (not as Cloud Run runtime variables). Override with
#   --build-arg NEXT_PUBLIC_API_URL=...
ARG NEXT_PUBLIC_API_URL=https://feature-backend-570395865015.asia-south1.run.app
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------- Run ----------
FROM node:22-slim
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Cloud Run sends traffic to $PORT; listen on all interfaces.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Standalone output: server.js + only the node_modules it needs.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 8080

CMD ["node", "server.js"]
