# ─── KitchenSync frontend (Vite build → static nginx) ─────────────────────────
# Stage 1: build the Vite bundle. VITE_API_URL is a build-time arg (Vite inlines
# VITE_* at build time) — written to .env.production so the built app points at the API.
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL=http://localhost:4000
RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production
RUN npm run build

# Stage 2: serve the static build with nginx.
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
