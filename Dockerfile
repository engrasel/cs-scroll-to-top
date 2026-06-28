# ──────────────────────────────────────────────────────────────
# Stage 1 — builder
# All devDependencies (Vite, TypeScript, @react-router/dev) are
# required to compile the app. Install everything, then build.
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy prisma schema first so the Prisma postinstall generates
# the correct binary targets declared in schema.prisma.
COPY package.json package-lock.json* ./
COPY prisma ./prisma

RUN npm ci

# Generate Prisma client before TypeScript compilation so types are available.
# Prisma v5+ no longer auto-generates via postinstall.
RUN npx prisma generate

COPY . .

RUN npm run build

# ──────────────────────────────────────────────────────────────
# Stage 2 — runner (production image)
# Only production deps. Prisma client is regenerated here for
# the linux-musl (Alpine) target declared in schema.prisma.
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./

# prisma dir must arrive before npm ci so the Prisma postinstall
# picks up the binaryTargets from schema.prisma.
COPY --from=builder /app/prisma ./prisma

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# startup script: generates Prisma client, retries migrations, then starts server
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]
