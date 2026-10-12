# Use Google Cloud Build's Node.js image for building
FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:alpine as builder

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install -f

# Copy the rest of the code
COPY . .

# Optional build-time public env values for client bundle
ARG NEXT_PUBLIC_MAIN_BACKEND_URL
ARG NEXT_PUBLIC_MAIN_AI_BACKEND_URL
ARG NEXT_PUBLIC_AUDIO_AI_BACKEND_URL
ENV NEXT_PUBLIC_MAIN_BACKEND_URL=$NEXT_PUBLIC_MAIN_BACKEND_URL
ENV NEXT_PUBLIC_MAIN_AI_BACKEND_URL=$NEXT_PUBLIC_MAIN_AI_BACKEND_URL
ENV NEXT_PUBLIC_AUDIO_AI_BACKEND_URL=$NEXT_PUBLIC_AUDIO_AI_BACKEND_URL

# Build the app
RUN npm run build

# Production stage - use distroless for smaller, more secure image
FROM gcr.io/distroless/nodejs20-debian12

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Cloud Run expects app to listen on $PORT
ENV PORT 8080

# Expose port
EXPOSE 8080

# Start in production mode
CMD ["./node_modules/.bin/next", "start"]
