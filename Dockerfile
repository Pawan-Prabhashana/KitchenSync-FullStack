# ─── KitchenSync API (Node/Express) ───────────────────────────────────────────
# The server runs the TypeScript entry directly via tsx (no build step). It reads
# PORT / MONGODB_URI / DATA_SOURCE / JWT_SECRET / CORS_ORIGIN from the environment
# (supplied by docker-compose). Note the server also imports shared types/data from
# src/, so the whole repo is copied in.
FROM node:20-slim

WORKDIR /app

# Install deps first for better layer caching.
COPY package*.json ./
RUN npm ci

# App source (server/ + src/ + data).
COPY . .

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "run", "server"]
