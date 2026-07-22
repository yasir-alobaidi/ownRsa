# --- Stage 1: build the static export -----------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps first so this layer is cached unless package*.json changes
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
# BASE_PATH is only needed for GitHub Pages project sites (/<repo>/).
# For Docker/self-hosting we serve from the root, so leave it empty.
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
RUN npm run build
# next.config.ts has output:"export", so this produces a static ./out folder

# --- Stage 2: serve the static files with nginx --------------------------
FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
