# --- STAGE 1: Builder ---------------------------------------------------------
FROM node:lts-alpine AS builder

WORKDIR /app

# Install pnpm globally in the builder image.
RUN npm install -g pnpm

# Copy base project files that affect pnpm install.
COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json ./
COPY .npmrc ./

# Install monorepo-level dependencies using pnpm reproducible builds
RUN pnpm install --frozen-lockfile

# Copy the entire Nx monorepo source code.
COPY . .

# Build the Angular application in production mode
RUN pnpm exec nx build example-angular --configuration=production

# --- STAGE 2: Runner (Node.js for server.mjs) ---------------------------------
FROM node:lts-alpine

# Create, configure and set a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

WORKDIR /app

# Copy built output
COPY --from=builder /app/dist/examples/angular/browser ./browser
COPY --from=builder /app/dist/examples/angular/server ./server

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "server/server.mjs"]
