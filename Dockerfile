# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package manager files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install


# Stage 2: Build the application
FROM node:20-slim AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Add cache busting argument
ARG CACHE_BUST=1
RUN echo "Cache bust: $CACHE_BUST"

# Copy all source code
COPY . .

# Build the Next.js application
RUN pnpm run build


# Stage 3: Production image
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

# Copiar script de inicio
COPY --chown=nextjs:nodejs start.sh ./
RUN chmod +x start.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["./start.sh"]
